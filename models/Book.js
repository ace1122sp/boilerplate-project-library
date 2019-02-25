const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const BookSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
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

BookSchema.static('findAll', function() {
  return this.aggregate([{
    $project: {
      title: 1,
      commentcount: { $size: "$comments"}
    }
  }])
    .then(books => {
      return books;
    })
    .catch(err => {
      throw err;
    });
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;