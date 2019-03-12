import React, { useState } from 'react';

import { fetchNewBook } from '../../libs/api-caller';
import { clientSocket } from '../../libs/client-socket';
import { API_BASE } from '../../constants';

const AddBook = ({ close, handleError }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    fetchNewBook(API_BASE, inputValue)
    .then(res => {
        // home.emit('new book', res);
        clientSocket.emit('new book', res);
        close();
      })
      .catch(err => {
        handleError();
      });
    setInputValue('');
  }

  const handleChange = e => {
    setInputValue(e.target.value);
  }

  return (
    <div className='dialogue-card'>
      <button onClick={close} className='btn-in-corner'>x</button>
      <form onSubmit={handleSubmit} className='dialogue-main'>
        <label>Book Title </label>
        <input type='text' placeholder='new book' autoFocus onChange={handleChange} value={inputValue} required />
        <button className='standard-btn'>add</button>
      </form>
    </div>
  );
}  

export default AddBook;