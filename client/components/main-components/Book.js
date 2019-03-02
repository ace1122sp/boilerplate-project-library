import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import NoComments from '../helper-components/NoComments';

import { fetchBooks, fetchDeleteBooks } from '../../libs/api-caller';
import { API_BASE } from '../../constants';

const Book = ({ match }) => {
  const [title, setTitle] = useState('Book');
  const [deleteDialogue, toggleDeleteDialogue] = useState(false);
  const [deleted, updateDeletedStatus] = useState(false);

  const URL = API_BASE + '/' + match.params.id;

  useEffect(() => {
    fetchBooks(URL)
      .then(book => {
        setTitle(book.title);        
      })
      .catch(err => {}); // to handle
  }, []);

  const deleteHandler = () => {
    fetchDeleteBooks(URL)
      .then(res => {
        toggleDeleteDialogue(false);
        updateDeletedStatus(true);
      })
      .catch(res => {}); // to handle
  };

  return (
    <main>
      {deleted && <Redirect to="/" />}
      {deleteDialogue && ReactDOM.createPortal(<DeleteDialogue close={() => toggleDeleteDialogue(false)} deleteHandler={deleteHandler} />, portal)}
      <h1>{title}</h1>
      <NoComments />
      <div>
        <button onClick={deleteHandler}>delete book</button>
      </div>
      <form>
        <input type='text' placeholder='your comment' />
        <button>add</button>
      </form>
    </main>
  );
}
  
export default Book;