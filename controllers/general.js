const path = require('path');

const notFound = (req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found');
};

const sendIndexHTML = (req, res) => {
  res.sendFile(path.resolve('views', 'index.html'));
};

module.exports = { notFound, sendIndexHTML };