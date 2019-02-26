const { sanitizeParam, sanitizeBody } = require('express-validator/filter');
const { param, validationResult } = require('express-validator/check');

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

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    next();
  }
};

module.exports = {
  sanitizeAndValidateId,
  sanitizeTitle, 
  sanitizeComment,
  handleValidationErrors
};

