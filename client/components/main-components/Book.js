import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { fetchBooks, fetchDeleteBooks, fetchComment } from '../../libs/api-caller';
import { API_BASE } from '../../constants';

const Book = ({ match }) => {
  const [title, setTitle] = useState('Book');
  const [comments, updateComments] = useState([]);
  const [deleteDialogue, toggleDeleteDialogue] = useState(false);
  const [deleted, updateDeletedStatus] = useState(false);
  const [commentValue, updateCommentValue] = useState('');

  const URL = API_BASE + '/' + match.params.id;
  
  useEffect(() => {
    fetchBooks(URL)
      .then(book => {
        setTitle(book.title);        
        updateComments([...book.comments]);
      })
      .catch(err => {}); // to handle
  }, []);

  const deleteHandler = () => {
    fetchDeleteBooks(URL)
      .then(res => {
        toggleDeleteDialogue(false);
        updateDeletedStatus(true);
      })
      .catch(res => {}); // to handle
  };

  const renderComments = () => comments.map((comment, i) => <li key={i}>{comment}</li>);

  const handleInputChange = e => {
    updateCommentValue(e.target.value);
  };

  const sendComment = e => {
    e.preventDefault();
    fetchComment(URL, commentValue)
      .then(res => {
        console.log(res);
        updateCommentValue('');
      })
      .catch(err => {}); // to handle
  }

  return (
    <main>
      {deleted && <Redirect to="/" />}
      {deleteDialogue && ReactDOM.createPortal(<DeleteDialogue close={() => toggleDeleteDialogue(false)} deleteHandler={deleteHandler} />, portal)}
      <h1>{title}</h1>
      <section>
        {!comments.length && <p>No comments yet...</p>}
        <ul>
          {renderComments()}
        </ul>
      </section>      
      <div>
        <button onClick={deleteHandler}>delete book</button>
      </div>
      <form onSubmit={sendComment}>
        <input type='text' placeholder='your comment' onChange={handleInputChange} value={commentValue} />
        <button>add</button>
      </form>
    </main>
  );
}
  
export default Book;