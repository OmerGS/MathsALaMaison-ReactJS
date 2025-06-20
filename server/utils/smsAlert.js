import dotenv from 'dotenv';
import axios from 'axios'; 
import { logger } from '../config/logger.js';

dotenv.config();

/**
 * The username for accessing the Free Mobile SMS API.
 * @type {string | undefined}
 * @constant
 * @default process.env.FREE_MOBILE_USER
 */
const user = process.env.FREE_MOBILE_USER;

/**
 * The token (password) for authenticating with the Free Mobile SMS API.
 * @type {string | undefined}
 * @constant
 * @default process.env.FREE_MOBILE_TOKEN
 */
const token = process.env.FREE_MOBILE_TOKEN;

/**
 * Sends an SMS alert to the admin in case of a critical server error.
 * 
 * This function sends an SMS message to the admin using Free Mobile's SMS API. It sends the message
 * with a specific format indicating a critical server error.
 * 
 * @param {string} message - The message describing the critical error that will be sent in the SMS alert.
 * @returns {void}
 * @example
 * sendSmsAlert("Database connection error");
 */
export function sendSmsAlert(message) {
    if (!user || !token) {
        console.error("Free Mobile user or token is not set.");
        return;
    }

    const url = `https://smsapi.free-mobile.fr/sendmsg?user=${user}&pass=${token}&msg=${encodeURIComponent("Une erreur critique est survenue dans le serveur : " + message)}`;

    axios.get(url)
        .then(() => {
            console.log("Admin alert sent successfully.");
        })
        .catch((error) => {
            console.error("Failed to send admin alert:", error);
        });
}

/**
 * Initializes error handlers for uncaught exceptions and unhandled promise rejections.
 * 
 * This function sets up global error handlers for uncaught exceptions and unhandled promise rejections.
 * When either of these errors occur, the error is logged, and an SMS alert is sent to the admin.
 * 
 * @returns {void}
 * @example
 * initializeErrorHandlers(); // Sets up global error handlers
 */
export function initializeErrorHandlers() {
    process.on('uncaughtException', (error) => {
        logger.warn(`Unhandled Exception: ${error.message}`);
        sendSmsAlert(error.message);
    });

    process.on('unhandledRejection', (reason) => {
        logger.warn(`Unhandled Rejection: ${reason}`);
        sendSmsAlert(reason?.message || String(reason));
    });
}
