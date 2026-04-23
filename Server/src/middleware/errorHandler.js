const errorHandler = (err, req, res, next) => {
  let msg = err.message || 'Server error';
  let status = err.statusCode || 500;

  if (err.name === 'CastError') { msg = 'Resource not found'; status = 404; }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    msg = `${field} already exists`; status = 400;
  }
  if (err.name === 'ValidationError') {
    msg = Object.values(err.errors).map(e => e.message).join(', '); status = 400;
  }

  console.error(`[ERROR] ${status} - ${msg}`);
  res.status(status).json({ success: false, message: msg });
};

module.exports = errorHandler;