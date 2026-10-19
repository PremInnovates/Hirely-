// middleware/errorMiddleware.js
// Two-part error handling used by every route in the app:
//  1. notFound   - catches requests to routes that don't exist (404)
//  2. errorHandler - catches every thrown/next(err) error and returns a
//                     clean, consistent JSON shape instead of leaking
//                     stack traces or raw Mongo/Mongoose errors to the client.

const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // If a controller set res.status already, keep it; otherwise default to 500.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Something went wrong. Please try again.';

  // Mongoose bad ObjectId (CastError) -> treat as 404, not a 500.
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found.';
  }

  // Mongoose validation errors -> 400 with a combined message.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Duplicate key error (e.g. unique email) -> 400 with a friendly message.
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} is already in use.` : 'Duplicate field value entered.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack traces are only ever sent in development, never in production.
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
