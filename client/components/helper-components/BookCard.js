import React from 'react';

const BookCard = ({ title, commentcount }) => 
  <li>
    <b>{title}</b> <i>{commentcount} {commentcount == 1 ? 'comment' : 'comments'}</i>
  </li>

export default BookCard;