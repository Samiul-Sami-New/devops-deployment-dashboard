function write(level, event, fields = {}) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...fields
  });
  const output = level === 'error' ? console.error : console.log;
  output(entry);
}

const logger = {
  info: (event, fields) => write('info', event, fields),
  error: (event, fields) => write('error', event, fields)
};

module.exports = { logger };
