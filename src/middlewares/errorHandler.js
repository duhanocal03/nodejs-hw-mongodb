const { isHttpError } = require('http-errors');

const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

   res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: null,
  });
};

module.exports = { errorHandler };
