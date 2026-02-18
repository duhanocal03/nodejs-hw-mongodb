const { isHttpError } = require('http-errors');

const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: 'Something went wrong',
  });
};

module.exports = { errorHandler };
