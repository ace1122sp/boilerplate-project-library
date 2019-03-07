import React, { useState } from 'react';
import { fetchNewBook } from '../../libs/api-caller';
import { API_BASE } from '../../constants';
import io from 'socket.io-client';

const socket = io();

const AddBook = ({ close }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    fetchNewBook(API_BASE, inputValue)
      .then(res => {
        socket.emit('new book', res);
        close(); // temporary solution
      })
      .catch(err => {}); // to handle
    setInputValue('');
  }

  const handleChange = e => {
    setInputValue(e.target.value);
  }

  return (
    <div>
      <button onClick={close}>x</button>
      <form onSubmit={handleSubmit}>
        <label>Book Title</label>
        <input type='text' placeholder='new book' autoFocus onChange={handleChange} value={inputValue} required />
        <button>add</button>
      </form>
    </div>
  );
}  

export default AddBook;