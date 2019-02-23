const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const LibrarySchema = new mongoose.Schema({
  books: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Book'
  }
});

const Library = mongoose.model('Library', LibrarySchema);

module.exports = Library;