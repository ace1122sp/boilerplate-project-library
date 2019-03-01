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
    .catch(err => {})
} 

const Home = () => {
  const [books, updateBooks] = useState([]);
  const [loading, setLoadingStatus] = useState(true);

  const addBooks = () => {
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

  const showBooks = books.map(book => <BookCard key={Date.now()} title={book.title} commentcount={book.commentcount} />);

  useEffect(() => {
    addBooks();
  }, []);

  return (
    <main>
      {loading && <LoadingPanel />}
      <section id='book-list'>
        {books.length === 0 && <EmptyLibrary />}
        <ul>{showBooks}</ul>
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