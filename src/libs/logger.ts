import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

// Define Datadog-compatible log levels
const levels = {
  error: 3,
  warn: 4,
  info: 6,
  debug: 7
};

// Define the custom log format
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return JSON.stringify({
    timestamp,
    level: level.toLowerCase(),
    message,
    service: 'digital-thread-backend',
    ddsource: 'nodejs',
    ddtags: process.env.DD_TAGS || 'env:local'
  });
});

// Create the logger
const logger = createLogger({
  levels,
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format((info) => {
      info.level = info.level.toLowerCase();
      return info;
    })(),
    customFormat
  ),
  transports: [new transports.Console()]
});

// If in development mode, log all levels
if (process.env.IS_LOCAL_ENV) {
  logger.level = 'debug';
}

export default logger;
