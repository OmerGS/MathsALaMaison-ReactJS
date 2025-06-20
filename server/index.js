import express from 'express';
import dotenv from 'dotenv';
import { logger } from '../src/config/logger.js';
import { apiKeyMiddleware } from '../src/middlewares/apiKeyMiddleware.js';
import { swaggerUi, swaggerSpec } from '../swagger.js';
import jwt from "jsonwebtoken";

import userEndpoints from '../src/routes/v2/userEndpoint.js';
import authEndpoints from '../src/routes/v2/authEndpoints.js';
import adminEndpoints from '../src/routes/v2/adminEndpoint.js';
import questionEndpoints from '../src/routes/v2/questionEndpoint.js';
import statisticEndpoints from '../src/routes/v2/statisticEndpoint.js';
import validationEndpoints from '../src/routes/v2/validationEndpoint.js';
import gameEndpoints from '../src/routes/v2/gameEndpoint.js';

import { startWebSocketServer } from '../src/services/webSocket.js';
import { initializeErrorHandlers } from '../src/utils/smsAlert.js';
import '../src/utils/consoleCommands.js';

import { printCredits, getTimestamp } from '../src/config/credits.js';
import { displayAsciiArt } from './utils/asciiArt.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://game.mathsalamaison.fr", "https://game.mathsalamaison.fr"];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("CORS error: Origin not allowed -", origin);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.SERVER_PORT;

/**
 * Middleware to parse incoming JSON requests
 */
app.use(express.json());
/**
 * Middleware to validate API key for all incoming requests
 */
app.use(apiKeyMiddleware);

/**
 * Middleware to log details of incoming requests such as IP, HTTP method, and URL
 */
app.use((req, res, next) => {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.socket.remoteAddress;

  let email = 'Unauthenticated';

  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.decode(refreshToken); 
      if (decoded?.email) {
        email = decoded.email;
      }
    } catch (err) {
      
    }
  }

  const { method, originalUrl } = req;
  logger.info(`[${method}] request from ${ip} by ${email} to ${originalUrl}`);
  next();
});

/**
 * Route handlers for different resources
 * - User routes
 * - Question routes
 * - Miscellaneous routes
 * - Validation Code
 */
app.use('/v2/admin/', adminEndpoints);
app.use('/v2/auth/', authEndpoints);
app.use('/v2/game', gameEndpoints);
app.use('/v2/question/', questionEndpoints);
app.use('/v2/stats/', statisticEndpoints);
app.use('/v2/user/', userEndpoints);
app.use('/v2/validation/', validationEndpoints);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * Start the server and log connection details
 */
const server = app.listen(port, async () => {
    await displayAsciiArt();  
    await printCredits();
    console.log(`${getTimestamp()} Started new session on port ${port}`)
    console.log(`${getTimestamp()} Connecting to database host: ${process.env.DB_HOST}:${process.env.DB_PORT}`)
    console.log(`${getTimestamp()} Database found: ${process.env.DB_DATABASE}`)
    console.log(`${getTimestamp()} User '${process.env.DB_USER}' connected to database`)
    startWebSocketServer(server);
});


// Initialize error handlers for uncaught exceptions and unhandled promise rejections
initializeErrorHandlers();