import React, { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EmptyLibrary from '../helper-components/EmptyLibrary';
import LoadingPanel from '../helper-components/LoadingPanel';
import BookCard from '../helper-components/BookCard';
import AddBook from '../helper-components/AddBook';
import DeleteDialogue from '../helper-components/DeleteDialogue';
import ErrorScreen from '../helper-components/ErrorScreen';

import { fetchBooks, fetchDeleteBooks } from '../../libs/api-caller';
import { openDialogue, closeDialogue } from '../../libs/dom-manipulation';
import { clientSocket } from '../../libs/client-socket';
import { API_BASE, SOMETHING_WRONG } from '../../constants';

const portal = document.getElementById('portal');

const Home = () => {
  const [books, updateBooks] = useState([]);
  const [loading, setLoadingStatus] = useState(true);
  const [addBookDialogue, toggleAddBookDialogue] = useState(false);
  const [error, updateErrorStatus] = useState(false);
  const [deleteDialogue, toggleDeleteDialogue] = useState(false);

  const renderBooks = () => books.map(book => <li key={book._id} className='book-card long-text-handle'><Link to={`/books/${book._id}`} ><BookCard title={book.title} commentcount={book.commentcount} /></Link></li>);

  useEffect(() => {    
    setInitBooks();    
  }, []);

  useEffect(() => {    
    // home.subscribe('new book', book => { 
    //   updateBooks(books => [...books, book]);
    // });
    clientSocket.subscribe('new book', book => { 
      updateBooks(books => [...books, book]);
    });

    // home.subscribe('delete book', id => {
    //   updateBooks(books => books.filter(book => book._id !== id));
    // });
    clientSocket.subscribe('delete book', id => {
      updateBooks(books => books.filter(book => book._id !== id));
    });

    // home.subscribe('delete all books', () => {
    //   updateBooks([]);
    // });
    clientSocket.subscribe('delete all books', () => {
      updateBooks([]);
    });

    return () => {
      const events = ['new book', 'delete book', 'delete all books'];
      // events.forEach(event => home.unsubscribe(event));
      events.forEach(event => clientSocket.unsubscribe(event));
    };
  }, []);

  const setInitBooks = () => {
    fetchBooks(API_BASE)
      .then(res => {        
        updateBooks(() => {
          return [...res];
        });
        setLoadingStatus(false); 
      })
      .catch(err => {
        updateErrorStatus(true);
      });
  };  

  const deleteHandler = () => {
    fetchDeleteBooks(API_BASE)
      .then(res => {
        updateBooks([]);
        // home.emit('delete all books');
        clientSocket.emit('delete all books');
      })
      .catch(err => {})
      .then(() => {
        closeDialogue(portal, toggleDeleteDialogue);
      });
  };
 
  const RenderHtml = () => 
    <Fragment>
      <section id='book-list' className='section-list'> 
        {books.length === 0 && <EmptyLibrary />}
        <ul>{renderBooks()}</ul>
      </section>      
      <aside id='controls-main' className='aside-controls'>
        <button id='add-book' className='control-buttons' onClick={() => openDialogue(portal, toggleAddBookDialogue)}>
        <FontAwesomeIcon size='1x' icon='plus' /> <FontAwesomeIcon size='2x' icon='book' />
        </button>
        <button id='delete-all' className='control-buttons' onClick={() => openDialogue(portal, toggleDeleteDialogue)}>
        <FontAwesomeIcon size='2x' icon='trash-alt' /> delete all
        </button>
      </aside>
    </Fragment>

  const HomeWrapper = () => 
    <Fragment>
      {addBookDialogue && createPortal(<AddBook close={() => closeDialogue(portal, toggleAddBookDialogue)} handleError={() => updateErrorStatus(true)} />, portal)}
      {deleteDialogue && createPortal(<DeleteDialogue close={() => closeDialogue(portal, toggleDeleteDialogue)} deleteHandler={deleteHandler} />, portal)}
      {loading ? <LoadingPanel /> : <RenderHtml />}
    </Fragment>

  return ( 
    <main>
      {error ? <ErrorScreen msg={SOMETHING_WRONG} /> : <HomeWrapper />} 
    </main>
  );
}

export default Home;