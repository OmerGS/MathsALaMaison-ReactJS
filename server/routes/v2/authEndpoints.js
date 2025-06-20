import express from 'express';
import { pool } from '../../config/database.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import cookie from 'cookie';
import { verifyToken } from '../../middlewares/token-check.js';
import { logger } from '../../config/logger.js';
import { sendNewDeviceMail, sendSignupMail } from '../../services/mailTemplate.js';

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

/**
 * @openapi
 * /v2/auth/login:
 *   post:
 *     summary: User login to get access and refresh tokens
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongPassword123
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 authorized:
 *                   type: boolean
 *                   description: Whether the user is premium and authorized
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 user:
 *                   type: object
 *                   description: User information (present only if authorized)
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 42
 *                     pseudo:
 *                       type: string
 *                       example: "MathGeek"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                     isPremium:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Mot de passe incorrect."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé."
 *       422:
 *         description: Missing or invalid email/password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email et mot de passe sont requis."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur."
 */
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ success: false, message: "Email et mot de passe sont requis." });
    }

    email = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ success: false, message: "Adresse e-mail invalide." });
    }

    const [result] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
    }

    const user = result[0];

    const salt = user.salt;
    const hash = crypto.createHash('sha256').update(password + salt).digest('hex');

    if (hash !== user.password) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect." });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      randValue: crypto.randomBytes(32).toString('hex')
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '180d' });

    const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const device_info = req.headers['user-agent'];
    const expired_at = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO sessions (user_id, refresh_token, ip_address, device_info, expired_at)
        VALUES (?, ?, ?, ?, ?)`,
      [user.id, refreshToken, ip_address, device_info, expired_at]
    );

    res.setHeader('Set-Cookie', [
      cookie.serialize('accessToken', accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 2 * 60, 
          path: '/'
      }),
      cookie.serialize('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: 6 * 30 * 24 * 60 * 60,
          path: '/'
      })
    ]);

      sendNewDeviceMail(
        user.email,
        user.pseudo,
        ip_address,
        device_info,
        new Date()
    );

    if(user.isPremium){
      return res.json({
        success: true,
        authorized: user.isPremium,
        message: "Connexion réussie",
        user: user
      });
    } else {
      return res.json({
        success: true,
        authorized: user.isPremium,
        message: "Votre compte est en attente de validation par un administrateur.",
      });
    }
  } catch (err) {
      console.error('Erreur lors du login :', err);
      return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

/**
 * @openapi
 * /v2/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pseudo
 *               - email
 *               - password
 *             properties:
 *               pseudo:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 16
 *                 example: "MathLover"
 *                 description: User nickname between 2 and 16 characters
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *                 description: User email address
 *               password:
 *                 type: string
 *                 minLength: 10
 *                 format: password
 *                 example: "strongPassword123"
 *                 description: Password with minimum 10 characters
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: integer
 *                   example: 123
 *                 pseudo:
 *                   type: string
 *                   example: "MathLover"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "user@example.com"
 *       400:
 *         description: Validation error or duplicate entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "The email is already in use"
 *       500:
 *         description: Server error during user creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error during account creation"
 */
router.post('/register', async (req, res) => {
  const { pseudo, email, password } = req.body;

  const emailNormalized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (pseudo.length < 2 || pseudo.length > 16) {
    return res.status(400).json({ success: false, message: "Le pseudo doit contenir entre 2 et 16 caractères" });
  }

  if(password.length < 10){
    return res.status(400).json({success: false, message: "Le mot de passe doit contenir au moins 10 caractères"});
  }

  if (!emailRegex.test(emailNormalized)) {
    return res.status(400).json({ success: false, message: "L'adresse email est invalide" });
  }

  try {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(password + salt).digest('hex');

    const [result] = await pool.execute(
      'INSERT INTO User (pseudo, email, password, salt) VALUES (?, ?, ?, ?)',
      [pseudo, emailNormalized, hash, salt]
    );

    res.json({ success: true, id: result.insertId, pseudo, email });
    sendSignupMail(emailNormalized, pseudo);

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const field = error.sqlMessage.includes('email') ? 'email' : 'pseudo';
      return res.status(400).json({ success: false, message: `Le ${field} est déjà utilisé` });
    }

    logger.error('Erreur lors de l\'insertion de l\'utilisateur :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la création du compte' });
  }
});

/**
 * @openapi
 * /v2/auth/logout:
 *   post:
 *     summary: Logout user by deleting refresh token and clearing cookies
 *     tags:
 *       - Authentication
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Deletes the user's refresh token from the database and clears the access and refresh token cookies.
 *     responses:
 *       200:
 *         description: Successful logout and tokens cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Déconnexion réussie et tokens supprimés"
 *       401:
 *         description: Unauthorized – missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh token missing or access token invalid"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.post('/logout', verifyToken, async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];

  if (refreshToken) {
    await pool.query('DELETE FROM sessions WHERE refresh_token = ?', [refreshToken]);
    logger.info('Refresh Token supprimé de la base de données.');
  }

  res.setHeader('Set-Cookie', [
    cookie.serialize('accessToken', '', {
      httpOnly: true,
      secure: false, 
      maxAge: 0, 
      path: '/'
    }),
    cookie.serialize('refreshToken', '', {
      httpOnly: true,
      secure: false, 
      maxAge: 0, 
      path: '/'
    })
  ]);

  return res.json({ message: 'Déconnexion réussie et tokens supprimés' });
});

/**
 * @openapi
 * /v2/auth/delete:
 *   post:
 *     summary: Delete the authenticated user's account
 *     tags:
 *       - Authentication
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Deletes the user account associated with the authenticated user and clears authentication cookies.
 *     responses:
 *       200:
 *         description: User successfully deleted and logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully deleted and logged out.
 *       404:
 *         description: User not found or email mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found or email mismatch.
 *       401:
 *         description: Unauthorized – missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token missing or access token invalid
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.post('/delete', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const email = req.user.email;

    const [users] = await pool.query(
      'SELECT id FROM User WHERE id = ? AND email = ?',
      [userId, email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé ou email incorrect.' });
    }

    await pool.query('DELETE FROM User WHERE id = ?', [userId]);
    logger.info(`Utilisateur ${userId} supprimé avec succès.`);

    res.setHeader('Set-Cookie', [
      cookie.serialize('accessToken', '', {
        httpOnly: true,
        secure: false,
        maxAge: 0,
        path: '/'
      }),
      cookie.serialize('refreshToken', '', {
        httpOnly: true,
        secure: false,
        maxAge: 0,
        path: '/'
      })
    ]);

    return res.json({ message: 'Utilisateur supprimé avec succès et déconnecté.' });
  } catch (error) {
    logger.error('Erreur lors de la suppression utilisateur:', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

export async function logoutOtherDevices(userId, currentRefreshToken) {
  await pool.query(
    'DELETE FROM sessions WHERE user_id = ? AND refresh_token != ?',
    [userId, currentRefreshToken]
  );
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       description: Represents a user session storing refresh token and device info
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier of the session
 *           example: 456
 *         user_id:
 *           type: integer
 *           description: Identifier of the user owning the session
 *           example: 123
 *         refresh_token:
 *           type: string
 *           description: Refresh token string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the session was created
 *           example: "2025-06-20T12:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the session was last updated
 *           example: "2025-06-20T12:30:00Z"
 *         expired_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Timestamp when the session expires (nullable)
 *           example: "2025-12-31T23:59:59Z"
 *         ip_address:
 *           type: string
 *           format: ipv4
 *           nullable: true
 *           description: IP address from which the session was created
 *           example: "192.168.1.1"
 *         device_info:
 *           type: string
 *           nullable: true
 *           description: User agent or device information string
 *           example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
 *         last_login:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Last login timestamp for this session
 *           example: "2025-06-20T12:15:00Z"
 *       required:
 *         - id
 *         - user_id
 *         - refresh_token
 *         - created_at
 *         - updated_at
 *         - last_login
 */

export default router;