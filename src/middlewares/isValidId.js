const createHttpError = require('http-errors');
const { isValidObjectId } = require('mongoose');

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    return next(createHttpError(400, 'Invalid contact id'));
  }

  next();
};

module.exports = isValidId;