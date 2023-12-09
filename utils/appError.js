class AppError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.stack = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error' 
    this.operational = true

    Error.captureStackTrace(this, this.constructor) 
  }
}

module.exports = AppError