const { config } = require('../config/env');

function getStatus() {
  return {
    application: config.appName,
    version: config.appVersion,
    environment: config.environment,
    status: 'operational',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  };
}

module.exports = { getStatus };
