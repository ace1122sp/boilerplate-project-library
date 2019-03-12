import React, { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Redirect } from 'react-router-dom';

import DeleteDialogue from '../helper-components/DeleteDialogue';
import LoadingPanel from '../helper-components/LoadingPanel';
import ErrorScreen from '../helper-components/ErrorScreen';

import { fetchBooks, fetchDeleteBooks, fetchComment } from '../../libs/api-caller';
import { openDialogue, closeDialogue } from '../../libs/dom-manipulation';
import { API_BASE, SOMETHING_WRONG_OR_PAGE_NOT_EXIST } from '../../constants';

import '../../css/Book.scss';

import { home, books } from '../../libs/client-socket';

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
    // socket.on('delete book', id => {
    //   if (id === match.params.id) updateBookDeletedStatus(true);
    // });
    books.subscribe('delete book', id => {
      if (id === match.params.id) updateBookDeletedStatus(true);
    });

    books.subscribe('delete all books', () => {
      updateBookDeletedStatus(true);
    });

    books.subscribe('new comment', comment => {
      updateComments(comments => [...comments, comment]);
    });

    books.subscribe('typing comment', bookId => {
      if (bookId === match.params.id) updateTypingCommentStatus(true);
    });

    books.subscribe('typing comment end', bookId => {
      if (bookId === match.params.id) updateTypingCommentStatus(false);
    });
    
    return () => {          
      const events = ['delete book', 'delete all books', 'new comment', 'typing comment', 'typing comment end'];
      events.forEach(event => books.unsubscribe(event));
    }
  }); 

  const deleteHandler = () => {
    if (bookDeleted) return;
    fetchDeleteBooks(URL)
      .then(res => {
        books.emit('delete book', match.params.id);
        home.emit('delete book', match.params.id);
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
      books.emit('typing comment', match.params.id);
    } else {
      books.emit('typing comment end', match.params.id);
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
        books.emit('new comment', comment);
        books.emit('typing comment end', match.params.id);
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
      <button onClick={() => openDialogue(portal, toggleDeleteDialogue)} className='standard-btn'>delete book</button>
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