import React, { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Link, Redirect } from 'react-router-dom';

import EmptyLibrary from '../helper-components/EmptyLibrary';
import LoadingPanel from '../helper-components/LoadingPanel';
import BookCard from '../helper-components/BookCard';
import AddBook from '../helper-components/AddBook';
import DeleteDialogue from '../helper-components/DeleteDialogue';
import ErrorScreen from '../main-components/ErrorScreen';

import { fetchBooks, fetchDeleteBooks } from '../../libs/api-caller';
import { API_BASE } from '../../constants';

const portal = document.getElementById('portal');

const Home = () => {
  const [books, updateBooks] = useState([]);
  const [loading, setLoadingStatus] = useState(true);
  const [addBookDialogue, toggleAddBookDialogue] = useState(false);
  const [error, updateErrorStatus] = useState(false);
  const [deleteDialogue, toggleDeleteDialogue] = useState(false);

  const renderBooks = () => books.map(book => <Link to={`/books/${book._id}`} key={book._id}><BookCard title={book.title} commentcount={book.commentcount} /></Link>);

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
      .then(res => {})
      .catch(err => {});
    
    toggleDeleteDialogue(false);
  };

  useEffect(() => {
    setInitBooks();    
  }, []);

  const RenderHtml = () => 
    <Fragment>
      <section id='book-list'>
        {books.length === 0 && <EmptyLibrary />}
        <ul>{renderBooks()}</ul>
      </section>      
      <aside id='controls-main'>
        <button id='add-book' onClick={() => toggleAddBookDialogue(true)}>
          add book
        </button>
        <button id='delete-all' onClick={() => toggleDeleteDialogue(true)}>
          delete all
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