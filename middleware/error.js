


  const winston = require('winston');

module.exports = function (err, req, res, next) {
    // Log the error with Winston
    winston.error(err.message, { metadata: err });

    // Respond to the client
    res.status(500).send('Something failed.');
};
