const uuid4 = require('uuid/v4');

const Book = require('../models/Book');

const getAllBooks = (req, res, next) => {
  Book.findAll()
    .then(books => {
      res.json(books);
    })
    .catch(err => {
      next(err);
    });
};

const deleteAllBooks = (req, res, next) => {
  Book.deleteMany({})
    .then(() => {
      res.status(200).send('complete delete successful');
    })
    .catch(err => {
      next(err);
    });
};

const getBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {  
      if (!book) {
        res.status(404).send('no book exists');
      } else {
        res.json(book);
      }
    })
    .catch(err => {      
      next(err);
    });
};

const addBook = (req, res, next) => {
  let book = new Book(res.locals.book);
  book.save()
    .then(b => {
      res.status(201).json(b);
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.sendStatus(400);
      } else {
        next(err);
      }
    });
};

const deleteBook = (req, res, next) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).send('delete successful');
    })
    .catch(err => {
      next(err);
    });
};

const addComment = (req, res, next) => {
  Book.findByIdAndUpdate(req.params.id, { $push: { comments: req.body.comment } }, { new: true })
    .then(book => {
      res.status(201).json(book);
    })
    .catch(err => {
      next(err);
    });
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