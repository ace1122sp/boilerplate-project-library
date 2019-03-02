import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import EmptyLibrary from '../helper-components/EmptyLibrary';
import LoadingPanel from '../helper-components/LoadingPanel';
import BookCard from '../helper-components/BookCard';
import AddBook from '../helper-components/AddBook';

import { API_BASE } from '../../constants';

const portal = document.getElementById('portal');

const fetchBooks = url => {
  return fetch(url)
    .then(res => {
      if (!res.ok) return Promise.reject(res.status); // to handle
      return res.json();
    })
    .then(res => res)
    .catch(err => {}) // to handle
};

const Home = () => {
  const [books, updateBooks] = useState([]);
  const [loading, setLoadingStatus] = useState(true);
  const [addBookDialogue, toggleAddBookDialogue] = useState(false);

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

  const openAddBookDialogue = () => {
    toggleAddBookDialogue(true);
  };

  const closeAddBookDialogue = () => {
    toggleAddBookDialogue(false);
  };

  useEffect(() => {
    setInitBooks();    
  }, []);

  return (
    <main>
      {addBookDialogue && ReactDOM.createPortal(<AddBook close={closeAddBookDialogue} />, portal)}
      {loading && <LoadingPanel />}
      <section id='book-list'>
        {books.length === 0 && <EmptyLibrary />}
        <ul>{renderBooks()}</ul>
      </section>      
      <aside id='controls-main'>
        <button id='add-book' onClick={openAddBookDialogue}>
          add book
        </button>
        <button id='delete-all'>
          delete all
        </button>
      </aside>
    </main>
  );
}

export default Home;