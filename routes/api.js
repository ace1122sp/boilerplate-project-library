/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { getAllBooks, addBook, deleteAllBooks, getBook, addComment, deleteBook, formatBook } = require('../controllers/library');
const { sanitizeAndValidateId, sanitizeTitle, sanitizeComment } = require('../controllers/sanitization-and-validation');

module.exports = app => {
  app.route('/api/books')
    .get(getAllBooks)
    .post(sanitizeTitle, formatBook, addBook)    
    .delete(deleteAllBooks);

  app.route('/api/books/:id')
    .get(sanitizeAndValidateId, getBook)    
    .post(sanitizeAndValidateId, sanitizeComment, addComment)    
    .delete(sanitizeAndValidateId, deleteBook);
};
