function readPort(value) {
  const port = Number.parseInt(value || '3000', 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port number.');
  }
  return port;
}

const config = Object.freeze({
  appName: 'DevOps Deployment Dashboard',
  appVersion: process.env.APP_VERSION || '0.1.0',
  environment: process.env.ENVIRONMENT || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  port: readPort(process.env.PORT)
});

module.exports = { config };
