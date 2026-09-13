const { logger } = require('../utils/logger');

function errorHandler(error, request, response, next) {
  logger.error('unhandled_error', {
    method: request.method,
    path: request.originalUrl,
    message: error.message
  });

  if (response.headersSent) {
    return next(error);
  }

  return response.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.'
    }
  });
}

module.exports = { errorHandler };
