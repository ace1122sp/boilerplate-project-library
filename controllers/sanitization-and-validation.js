const { sanitizeParam, sanitizeBody } = require('express-validator/filter');
const { param } = require('express-validator/check');

const sanitizeAndValidateId = [  
  sanitizeParam('id')
    .trim()
    .escape(),
  param('id')
    .isUUID(4)
];

const sanitizeTitle = [
  sanitizeBody('title', 'comment')
    .trim()
    .escape()
];

const sanitizeComment = [
  sanitizeBody('comment')
    .trim()
    .escape()
];

module.exports = {
  sanitizeAndValidateId,
  sanitizeTitle, 
  sanitizeComment
};

