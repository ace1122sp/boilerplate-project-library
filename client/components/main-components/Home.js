import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import EmptyLibrary from '../helper-components/EmptyLibrary';
import LoadingPanel from '../helper-components/LoadingPanel';
import BookCard from '../helper-components/BookCard';
import AddBook from '../helper-components/AddBook';
import { fetchBooks, fetchDeleteAll } from '../../libs/api-caller';

import { API_BASE } from '../../constants';
import DeleteDialogue from '../helper-components/DeleteDialogue';

const portal = document.getElementById('portal');

const Home = () => {
  const [books, updateBooks] = useState([]);
  const [loading, setLoadingStatus] = useState(true);
  const [addBookDialogue, toggleAddBookDialogue] = useState(false);
  const [deleteDialogue, toggleDeleteDialogue] = useState(false);

  const renderBooks = () => books.map(book => <BookCard key={book._id} title={book.title} commentcount={book.commentcount} />);

  const setInitBooks = () => {
    fetchBooks(API_BASE)
      .then(res => {
        updateBooks(() => {
          return [...res];
        });
      })
      .catch(err => {
        console.error(err.message); // should render Error
      })
      .then(() => {
        setLoadingStatus(false); 
      });
  };  

  const deleteHandler = () => {
    fetchDeleteAll(API_BASE)
      .then(res => {})
      .catch(err => {});
    
    toggleDeleteDialogue(false);
  }

  useEffect(() => {
    setInitBooks();    
  }, []);

  return (
    <main>
      {addBookDialogue && ReactDOM.createPortal(<AddBook close={() => toggleAddBookDialogue(false)} />, portal)}
      {deleteDialogue && ReactDOM.createPortal(<DeleteDialogue close={() => toggleDeleteDialogue(false)} deleteHandler={deleteHandler} />, portal)}
      {loading && <LoadingPanel />}
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
    </main>
  );
}

export default Home;