const mongoose = require('mongoose');
const config = require('./config');

module.exports = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db.mongoURI, { useNewUrlParser: true })
    .then(() => {
      console.log('connected to db');
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
};