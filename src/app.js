const express = require('express');
const path = require('node:path');
const { getStatus } = require('./services/status.service');
const { requestLogger } = require('./middleware/request-logger');
const { notFound } = require('./middleware/not-found');
const { errorHandler } = require('./middleware/error-handler');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.use(requestLogger);
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/health', (request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.get('/api/status', (request, response) => {
    response.status(200).json({ data: getStatus() });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
