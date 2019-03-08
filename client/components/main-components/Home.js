import React, { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EmptyLibrary from '../helper-components/EmptyLibrary';
import LoadingPanel from '../helper-components/LoadingPanel';
import BookCard from '../helper-components/BookCard';
import AddBook from '../helper-components/AddBook';
import DeleteDialogue from '../helper-components/DeleteDialogue';
import ErrorScreen from '../main-components/ErrorScreen';

import { fetchBooks, fetchDeleteBooks } from '../../libs/api-caller';
import { unsubscribeSocketEvents } from '../../libs/socket-methods';
import { API_BASE } from '../../constants';

const portal = document.getElementById('portal');

const Home = ({ socket }) => {
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
    socket.on('new book', book => { 
      updateBooks(books => [...books, book]);
    });

    socket.on('delete book', id => {
      updateBooks(books => books.filter(book => book._id !== id));
    });

    socket.on('delete all books', () => {
      updateBooks([]);
    });

    // socket.on('comment added', comment => {
      
    // });
    return () => {
      unsubscribeSocketEvents(socket, ['new book', 'delete book', 'delete all books']);
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
        socket.emit('delete all books');
      })
      .catch(err => {});
    
    toggleDeleteDialogue(false);
  };

  const RenderHtml = () => 
    <Fragment>
      <section id='book-list' className='section-list'> 
        {books.length === 0 && <EmptyLibrary />}
        <ul>{renderBooks()}</ul>
      </section>      
      <aside id='controls-main' className='aside-controls'>
        <button id='add-book' className='control-buttons' onClick={() => toggleAddBookDialogue(true)}>
        <FontAwesomeIcon size='1x' icon='plus' /> <FontAwesomeIcon size='2x' icon='book' />
        </button>
        <button id='delete-all' className='control-buttons' onClick={() => toggleDeleteDialogue(true)}>
        <FontAwesomeIcon size='2x' icon='trash-alt' /> delete all
        </button>
      </aside>
    </Fragment>

  const HomeWrapper = () => 
    <Fragment>
      {addBookDialogue && createPortal(<AddBook close={() => toggleAddBookDialogue(false)} />, portal)}
      {deleteDialogue && createPortal(<DeleteDialogue close={() => toggleDeleteDialogue(false)} deleteHandler={deleteHandler} />, portal)}
      {loading ? <LoadingPanel /> : <RenderHtml />}
    </Fragment>

  return ( // msg for Error Screen should be gotten from constants
    <main>
      {error ? <ErrorScreen msg='something went wrong' /> : <HomeWrapper />} 
    </main>
  );
}

export default Home;