import React, { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Redirect } from 'react-router-dom';

import DeleteDialogue from '../helper-components/DeleteDialogue';
import LoadingPanel from '../helper-components/LoadingPanel';

import { fetchBooks, fetchDeleteBooks, fetchComment } from '../../libs/api-caller';
import { API_BASE } from '../../constants';
import ErrorScreen from './ErrorScreen';

const Book = ({ match }) => {
  const [title, setTitle] = useState('Book');
  const [comments, updateComments] = useState([]);
  const [loading, setLoadingStatus] = useState(true);
  const [error, updateErrorStatus] = useState(false);
  const [deleteDialogue, toggleDeleteDialogue] = useState(false);
  const [deleted, updateDeletedStatus] = useState(false);
  const [commentValue, updateCommentValue] = useState('');

  const URL = API_BASE + '/' + match.params.id;
  
  useEffect(() => {
    fetchBooks(URL)
      .then(book => {
        setTitle(book.title);        
        updateComments([...book.comments]);
        setLoadingStatus(false);
      })
      .catch(err => {
        updateErrorStatus(true);
      });
  }, []);

  const deleteHandler = () => {
    fetchDeleteBooks(URL)
      .then(res => {
        toggleDeleteDialogue(false);
        updateDeletedStatus(true);
      })
      .catch(res => {
        updateErrorStatus(true);
      });
  };

  const renderComments = () => comments.map((comment, i) => <li key={i}>{comment}</li>);

  const handleInputChange = e => {
    updateCommentValue(e.target.value);
  };

  const sendComment = e => {
    e.preventDefault();
    if (commentValue.length) {
      let comment = commentValue;
      fetchComment(URL, comment)
      .then(res => {})
      .catch(err => {
        updateErrorStatus(true);
      });
    }

    updateCommentValue('');
  };

  const RenderHtml = () => 
    <Fragment>
      <h1>{title}</h1>
      <section>
        {!comments.length && <p>No comments yet...</p>}
        <ul>
          {renderComments()}
        </ul>
      </section>      
      <div>
        <button onClick={() => toggleDeleteDialogue(true)}>delete book</button>
      </div>
      <form onSubmit={sendComment}>
        <input type='text' placeholder='your comment' onChange={handleInputChange} value={commentValue} />
        <button>add</button>
      </form>
    </Fragment>

  const BookWrapper = () => 
    <Fragment>
      {deleted && <Redirect to="/" />}
      {deleteDialogue && createPortal(<DeleteDialogue close={() => toggleDeleteDialogue(false)} deleteHandler={deleteHandler} />, portal)}
      {loading ? <LoadingPanel /> : <RenderHtml />}
    </Fragment>

  return (
    <main>
      {error ? <ErrorScreen msg='something went wrong' /> : <BookWrapper />}
    </main>
  );
}
  
export default Book;