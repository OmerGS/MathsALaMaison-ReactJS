import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

/**
 * The transporter is responsible for sending emails via the Gmail service.
 * It uses credentials stored in environment variables for authentication.
 * 
 * @constant {Object} transporter
 * @see {@link https://nodemailer.com/}
 */
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using the specified details.
 * 
 * This function sends an email through the configured email service using 
 * the provided recipient email, subject, and message body.
 * 
 * @function
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The message body of the email.
 * 
 * @returns {void} This function does not return any value.
 * 
 * @example
 * // Send a welcome email
 * sendMail('example@example.com', 'Welcome!', 'Hello, welcome to our service!');
 */
function sendMail(to, subject, message) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      logger.info('Erreur d\'envoi de l\'email :', error);
    } else {
      logger.info('Email envoyé avec succès');
    }
  });
}

export function sendHtmlMail(to, subject, htmlMessage) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlMessage,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      logger.info('Erreur d\'envoi de l\'email :', error);
    } else {
      logger.info('Email envoyé avec succès');
    }
  });
}


export default sendMail;