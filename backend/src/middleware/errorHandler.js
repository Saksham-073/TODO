
function notFound(req, res, next) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  if (err.code === 11000) {
    return res.status(409).json({ message: 'That value is already taken.' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (status >= 500) {
    console.error('Unhandled error:', err);
  }

  res.status(status).json({
    message: err.message || 'Something went wrong',
    ...(err.errors ? { errors: err.errors } : {}),
  });
}

module.exports = { notFound, errorHandler };
