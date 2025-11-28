const sanitizeHtml = require('sanitize-html');
const mongoSanitize = require('express-mongo-sanitize');

// Sanitize HTML content
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [], // No HTML tags allowed
          allowedAttributes: {}
        }).trim();
      }
    });
  }
  next();
};

// Prevent NoSQL injection
const noSqlSanitize = mongoSanitize({
  replaceWith: '_'
});

module.exports = { sanitizeInput, noSqlSanitize };