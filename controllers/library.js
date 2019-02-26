const Book = require('../models/Book');

const getAllBooks = (req, res) => {
  Book.findAll()
    .then(books => {
      res.json(books);
    })
    .catch(err => {})
};

const deleteAllBooks = (req, res) => {
  Book.deleteMany({})
    .then(() => {
      res.status(200).send('complete delete successful');
    })
    .catch(err => {})
};

const getBook = (req, res) => {
  Book.findById(req.params.id)
    .then(book => {  
      if (!book) return book;
      res.json(book);
    })
    .then(book => {
      res.status(404).send('no book exists');
    })
    .catch(err => {})
};

const addBook = (req, res) => {
  let book = new Book(res.locals.book);
  book.save()
    .then(b => {
      res.status(201).json(b);
    })
    .catch(err => {});
};

const deleteBook = (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).send('delete successful');
    })
    .catch(err => {});
};

const addComment = (req, res) => {
  Book.findByIdAndUpdate(req.params.id, { $push: { comments: req.body.comment } })
    .then(book => {
      res.status(201).json(book);
    })
    .catch(err => {})
};

module.exports = {
  getAllBooks, 
  deleteAllBooks,
  getBook,
  addBook, 
  deleteBook,
  addComment
};