const { logger } = require('../utils/logger');

function requestLogger(request, response, next) {
  const startedAt = process.hrtime.bigint();
  response.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    logger.info('http_request', {
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs: Number(durationMs.toFixed(2))
    });
  });
  next();
}

module.exports = { requestLogger };
