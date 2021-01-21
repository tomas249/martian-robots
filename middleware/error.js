/**
 *
 * Middleware that handles errors.
 * All errors end up here and are send to the user client.
 *
 * The plan is the following:
 *
 * 1. Use 'errorResponse' from utils to throw custom errors.
 *
 * 2. Wrap all functions with 'async' from middleware folder:
 *    this function acts as try/catch block that passes every
 *    error to next.
 *
 * 3. The error ends up at this file, located at the end of 'index'
 *    from routes, where all routes are located.
 *    Here, some mongoose errors are treated to make them more
 *    understandable, and finally, sent to the user client.
 *
 */
const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Mongoose bad ObjectId
  if (err.name == 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(404, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message.replace(/\r?\n|\r/g, '') || 'Server Error',
  });
};

module.exports = errorHandler;
