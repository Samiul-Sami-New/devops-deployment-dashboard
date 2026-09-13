const { createApp } = require('./app');
const { config } = require('./config/env');
const { logger } = require('./utils/logger');

const app = createApp();
const server = app.listen(config.port, () => {
  logger.info('server_started', {
    port: config.port,
    environment: config.environment,
    version: config.appVersion
  });
});

function shutdown(signal) {
  logger.info('server_stopping', { signal });
  server.close((error) => {
    if (error) {
      logger.error('server_shutdown_failed', { message: error.message });
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
