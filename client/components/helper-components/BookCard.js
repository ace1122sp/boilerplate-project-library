import React from 'react';

const BookCard = (title, commentcount) => 
  <li>
    <b>{title}</b> <i>{commentcount}</i>
  </li>

export default BookCard;