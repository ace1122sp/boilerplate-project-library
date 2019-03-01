import React from 'react';
import NoComments from '../helper-components/NoComments';

const Book = () => 
  <main>
    <h1>Book</h1>
    <NoComments />
    <div>
      <button>delete book</button>
    </div>
    <form>
      <input type='text' placeholder='your comment' />
      <button>add</button>
    </form>
  </main>

export default Book;