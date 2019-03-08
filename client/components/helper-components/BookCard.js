import React, { Fragment } from 'react';

const BookCard = ({ title, commentcount }) => 
  <Fragment>
    <b>{title} </b>
    <i>{commentcount || 0} {commentcount == 1 ? 'comment' : 'comments'}</i>
  </Fragment>

export default BookCard;