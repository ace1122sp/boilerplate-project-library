const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 1,
    max: 50,
    required: true
  },
  comments: {
    type: [String],
    min: 1,
    max: 500
  }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;