export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not found: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  if (err.name === 'CastError' || err.name === 'ValidationError') status = 400;
  if (err.code === 11000) status = 409;
  if (status === 409) err.message = 'A record with this value already exists.';
  res.status(status).json({ success: false, message: err.message || 'Server error' });
}
