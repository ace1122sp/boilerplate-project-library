const uuid4 = require('uuid/v4');

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
      console.log('book: \n', b);
      res.status(201).json(b);
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.sendStatus(400);
      } else {
        // to handle;
      }
    });
};

const deleteBook = (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).send('delete successful');
    })
    .catch(err => {});
};

const addComment = (req, res) => {
  Book.findByIdAndUpdate(req.params.id, { $push: { comments: req.body.comment } }, { new: true })
    .then(book => {
      res.status(201).json(book);
    })
    .catch(err => {})
};

const formatBook = (req, res, next) => {
  res.locals.book = { title: req.body.title, _id: uuid4() };
  next();
};

module.exports = {
  getAllBooks, 
  deleteAllBooks,
  getBook,
  addBook, 
  deleteBook,
  addComment,
  formatBook
};