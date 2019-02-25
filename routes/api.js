/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { getAllBooks, addBook, deleteAllBooks, getBook, addComment, deleteBook } = require('../controllers/library');

module.exports = app => {
  app.route('/api/books')
    .get(getAllBooks)
    .post(addBook)    
    .delete(deleteAllBooks);

  app.route('/api/books/:id')
    .get(getBook)    
    .post(addComment)    
    .delete(deleteBook);
};
