import React, { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Redirect } from 'react-router-dom';

import DeleteDialogue from '../helper-components/DeleteDialogue';
import LoadingPanel from '../helper-components/LoadingPanel';
import ErrorScreen from '../helper-components/ErrorScreen';

import { fetchBooks, fetchDeleteBooks, fetchComment } from '../../libs/api-caller';
import { openDialogue, closeDialogue } from '../../libs/dom-manipulation';
import { clientSocket } from '../../libs/client-socket';
import { API_BASE, SOMETHING_WRONG_OR_PAGE_NOT_EXIST } from '../../constants';

import '../../css/Book.scss';

const Book = ({ match }) => {
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
    clientSocket.enterRoom(match.params.id);
    
    clientSocket.subscribe('delete book', () => {
      updateBookDeletedStatus(true);
    });

    clientSocket.subscribe('delete all books', () => {
      updateBookDeletedStatus(true);
    });

    clientSocket.subscribe('new comment', comment => {
      updateComments(comments => [...comments, comment]);
    });

    clientSocket.subscribe('typing comment', () => {
      updateTypingCommentStatus(true);
    });

    clientSocket.subscribe('typing comment end', () => {
      updateTypingCommentStatus(false);
    });
    
    return () => {          
      const events = ['delete book', 'delete all books', 'new comment', 'typing comment', 'typing comment end'];
      events.forEach(event => clientSocket.unsubscribe(event));
      clientSocket.leaveRoom(match.params.id);
    }
  }); 

  const deleteHandler = () => {
    if (bookDeleted) return;
    fetchDeleteBooks(URL)
      .then(res => {
        clientSocket.emit('delete book', match.params.id);
        toggleDeleteDialogue(false);
        updateDeletedStatus(true);
      })
      .catch(res => {
        updateErrorStatus(true);
      })
      .then(() => {
        closeDialogue(portal);
      });
  };

  const renderComments = () => comments.map((comment, i) => <li key={i} className='comment'>{comment}</li>);

  const handleInputChange = e => {
    updateCommentValue(e.target.value);
    if (e.target.value.length > 0) {    
      clientSocket.emit('typing comment', match.params.id);
    } else {
      clientSocket.emit('typing comment end', match.params.id);
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
        clientSocket.emit('new comment', [match.params.id, comment]);
        clientSocket.emit('typing comment end', match.params.id);
      })
      .catch(err => {
        updateErrorStatus(true);
      });
    }

    updateCommentValue('');
  };

  const DeletedNotification = () => 
    <div className='notification'>
      <p>Somebody has just deleted this book. You can stay on this page, but you can't leave comments anymore.</p>
    </div>

  const Controls = () => 
    <div className='controls'>
      <button id='delete-book-btn' onClick={() => openDialogue(portal, toggleDeleteDialogue)} className='standard-btn'>delete book</button>
      <form onSubmit={sendComment}>
        <input type='text' placeholder='your comment' onChange={handleInputChange} value={commentValue} autoFocus />
        <button className='standard-btn'>add</button>
      </form>
    </div>

  const RenderHtml = () => 
    <Fragment>
      <h1 className='h1'>{title}</h1>
      <ul className='comments-section'>
        {!comments.length && <li>No comments yet...</li>}
        {renderComments()}
        {someoneTypingComment && <li><i>someone is typing...</i></li>}
      </ul>
      {!bookDeleted && <Controls />}
    </Fragment>

  const BookWrapper = () => 
    <Fragment>
      {deleted && <Redirect to="/" />}
      {deleteDialogue && createPortal(<DeleteDialogue close={() => closeDialogue(portal, toggleDeleteDialogue)} deleteHandler={deleteHandler} />, portal)}
      {loading ? <LoadingPanel /> : <RenderHtml />}
      {bookDeleted && <DeletedNotification />}
    </Fragment>

  return (
    <main className='main'>
      {error ? <ErrorScreen msg={SOMETHING_WRONG_OR_PAGE_NOT_EXIST} /> : <BookWrapper />}
    </main>
  );
}
  
export default Book;