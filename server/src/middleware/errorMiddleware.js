// middleware/errorMiddleware.js

/**
 * 404 — no route matched
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Final error handler — must have 4 parameters
 */
const errorHandler = (err, req, res, next) => {
  // If status was still 200, treat as 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
  }

  // Mongoose duplicate key (e.g. unique slug)
  if (err.code === 11000) {
    statusCode = 400;
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  res.status(statusCode).json({
    message: err.message || 'Server error',
    // Only in development — helps you debug, hide in production
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };