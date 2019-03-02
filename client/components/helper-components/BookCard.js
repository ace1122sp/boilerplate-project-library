import React from 'react';

const BookCard = ({ title, commentcount }) => 
  <li>
    <b>{title}</b> <i>{commentcount}</i> {commentcount == 1 ? 'comment' : 'comments'}
  </li>

export default BookCard;