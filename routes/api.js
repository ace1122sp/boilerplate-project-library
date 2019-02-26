/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { getAllBooks, addBook, deleteAllBooks, getBook, addComment, deleteBook, formatBook } = require('../controllers/library');
const { sanitizeAndValidateId, sanitizeTitle, sanitizeComment, handleValidationErrors } = require('../controllers/sanitization-and-validation');

module.exports = app => {
  app.route('/api/books')
    .get(getAllBooks)
    .post(sanitizeTitle, handleValidationErrors, formatBook, addBook)    
    .delete(deleteAllBooks);

  app.route('/api/books/:id')
    .get(sanitizeAndValidateId, handleValidationErrors, getBook)    
    .post(sanitizeAndValidateId, sanitizeComment, handleValidationErrors, addComment)    
    .delete(sanitizeAndValidateId, handleValidationErrors, deleteBook);
};
