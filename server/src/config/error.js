export class HTTPCustomError extends Error {
  constructor(statusCode, message) {
    super(message || "Internal Server Error!");
    this.statusCode = statusCode;
  }
}

export function httpErrorHandler(error, res) {
  if (!res) return null;

  const {
    statusCode = 500,
    message
  } = error

  return res.status(statusCode).json({
    status_code: error.statusCode || 500,
    message: message
  });
}