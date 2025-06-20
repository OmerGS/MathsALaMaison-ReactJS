import winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * Configures a logger using Winston with daily log rotation.
 * 
 * The logger logs messages with a timestamp and custom format. It outputs to the console and to daily log files, 
 * rotating them every day and limiting the file size and retention.
 * 
 * @constant {Object} logger - The Winston logger instance.
 * @property {string} level - The minimum logging level (e.g., 'info', 'warn').
 * @property {Object} format - Defines how log messages are formatted.
 * @property {Array} transports - Defines where the logs are output (console and daily rotated files).
 * @returns {Object} The logger instance.
 */
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
});