import React from 'react';

const AddBook = ({ close }) => 
  <div>
    <button onClick={close}>x</button>
    <form>
      <label>Book Title</label>
      <input type='text' placeholder='new book' autoFocus />
      <button>add</button>
    </form>
  </div>

export default AddBook;