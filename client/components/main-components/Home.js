import React, { useState, useEffect } from 'react';
import EmptyLibrary from '../helper-components/EmptyLibrary';
import LoadingPanel from '../helper-components/LoadingPanel';
import BookCard from '../helper-components/BookCard';

import { API_BASE } from '../../constants';

const fetchBooks = url => {
  return fetch(url)
    .then(res => {
      if (!res) return null;
      return res.json();
    })
    .then(res => res)
    .catch(err => {}) // to handle
} 

const Home = () => {
  const [books, updateBooks] = useState([]);
  const [loading, setLoadingStatus] = useState(true);

  const renderBooks = books => books.map(book => <BookCard key={book._id} title={book.title} commentcount={book.commentcount} />);

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

  useEffect(() => {
    setInitBooks();
  }, []);

  return (
    <main>
      {loading && <LoadingPanel />}
      <section id='book-list'>
        {books.length === 0 && <EmptyLibrary />}
        <ul>{renderBooks(books)}</ul>
      </section>
      <aside id='controls-main'>
        <button id='add-book'>
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