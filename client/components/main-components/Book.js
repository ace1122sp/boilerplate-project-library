import React, { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Redirect } from 'react-router-dom';

import DeleteDialogue from '../helper-components/DeleteDialogue';
import LoadingPanel from '../helper-components/LoadingPanel';

import { fetchBooks, fetchDeleteBooks, fetchComment } from '../../libs/api-caller';
import { API_BASE } from '../../constants';
import ErrorScreen from './ErrorScreen';

const Book = ({ match, socket }) => {
  const [title, setTitle] = useState('Book');
  const [comments, updateComments] = useState([]);
  const [bookDeleted, updateBookDeletedStatus] = useState(false);
  const [someoneTypingComment, updateTypingCommentStatus] = useState(false);
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

  useEffect(() => {    
    socket.on('delete book', id => {
      if (id === match.params.id) updateBookDeletedStatus(true);
    });

    socket.on('delete all books', () => {
      updateBookDeletedStatus(true);
    });

    socket.on('new comment', comment => {
      updateComments(comments => [...comments, comment]);
    });

    socket.on('typing comment', bookId => {
      if (bookId === match.params.id) updateTypingCommentStatus(true);
    });

    socket.on('typing comment end', bookId => {
      if (bookId === match.params.id) updateTypingCommentStatus(false);
    });
    
    return () => {
      socket.off('delete book');
      socket.off('delete book');
      socket.off('new comment');
      socket.off('typing comment');
      socket.off('typing comment end');
    }
  }); 

  const deleteHandler = () => {
    if (bookDeleted) return;
    fetchDeleteBooks(URL)
      .then(res => {
        socket.emit('delete book', match.params.id);
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
    if (e.target.value.length > 0) {
      socket.emit('typing comment', match.params.id);
    } else {
      socket.emit('typing comment end', match.params.id);
    }
  };

  const sendComment = e => {
    if (bookDeleted) return;
    e.preventDefault();
    if (commentValue.length) {
      let comment = commentValue;
      fetchComment(URL, comment)
      .then(res => {
        updateComments(comments => [...comments, comment]);
        socket.emit('new comment', comment);
      })
      .catch(err => {
        updateErrorStatus(true);
      });
    }

    updateCommentValue('');
  };

  const DeletedNotification = () => 
    <div>
      <p>Somebody has just deleted this book. You can still stay on this page, but you can't add comments.</p>
    </div>

  const Controls = () => 
    <Fragment>
      <div>
        <button onClick={() => toggleDeleteDialogue(true)}>delete book</button>
      </div>
      <form onSubmit={sendComment}>
        <input type='text' placeholder='your comment' onChange={handleInputChange} value={commentValue} autoFocus />
        <button>add</button>
      </form>
    </Fragment>

  const RenderHtml = () => 
    <Fragment>
      <h1>{title}</h1>
      <section>
        {!comments.length && <p>No comments yet...</p>}
        <ul>
          {renderComments()}
          {someoneTypingComment && <li><i>someone is typing...</i></li>}
        </ul>
      </section>      
      {!bookDeleted && <Controls />}
    </Fragment>

  const BookWrapper = () => 
    <Fragment>
      {deleted && <Redirect to="/" />}
      {deleteDialogue && createPortal(<DeleteDialogue close={() => toggleDeleteDialogue(false)} deleteHandler={deleteHandler} />, portal)}
      {loading ? <LoadingPanel /> : <RenderHtml />}
      {bookDeleted && <DeletedNotification />}
    </Fragment>

  return (
    <main>
      {error ? <ErrorScreen msg='something went wrong' /> : <BookWrapper />}
    </main>
  );
}
  
export default Book;