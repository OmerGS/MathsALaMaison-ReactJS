import express from 'express';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { pool } from '../../config/database.js';
import { logger } from '../../config/logger.js';
import { sendValidationCodeMail } from '../../services/mailTemplate.js';
import { verifyToken } from '../../middlewares/token-check.js';

/**
 * Express Router instance for handling routing within the application.
 * This object will be used to define routes and their handlers for various HTTP methods.
 * 
 * @constant
 * @type {express.Router}
 */
const router = express.Router();

const saltRounds = 10;
const verificationCodeExpireTime = 10;

/**
 * @openapi
 * /v2/validation/ask-code:
 *   post:
 *     summary: Request a new verification code sent by email
 *     tags:
 *       - Validation
 *     description: |
 *       Sends a verification code to the specified email.
 *       Limits requests to avoid spamming (30 seconds minimum between requests).
 *       Previous unused codes for the email are invalidated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to send the verification code
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Code envoyé par email
 *       400:
 *         description: Missing or invalid email in request body
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
 *                   example: Email manquant
 *       429:
 *         description: Too many requests, user must wait before requesting a new code
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
 *                   example: Merci de patienter avant de redemander un code.
 *       500:
 *         description: Server error while generating the verification code
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
 *                   example: Erreur serveur
 */
router.post('/ask-code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email manquant' });
  }

  try {
    await pool.query(
      `DELETE FROM verification_codes WHERE expires_at <= NOW()`
    );

    const [recentCodes] = await pool.query(
      `SELECT * FROM verification_codes WHERE email = ? AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`,
      [email]
    );

    if (recentCodes.length > 0) {
      const lastRequestTime = new Date(recentCodes[0].created_at);
      const now = new Date();
      const diffMs = now - lastRequestTime;
      const minDelayMs = 30 * 1000;

      if (diffMs < minDelayMs) {
        return res.status(429).json({
          success: false,
          message: 'Merci de patienter avant de redemander un code.'
        });
      }
    }

    await pool.query(
      `UPDATE verification_codes SET used = TRUE WHERE email = ? AND used = FALSE`,
      [email]
    );

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedCode = await bcrypt.hash(code, saltRounds);

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + verificationCodeExpireTime * 60000);

    const sql = `
      INSERT INTO verification_codes (email, code_hash, created_at, expires_at, used)
      VALUES (?, ?, ?, ?, false)
    `;
    await pool.query(sql, [email, hashedCode, createdAt, expiresAt]);

    const message = `Le code est ${code}, ce code expirera dans ${verificationCodeExpireTime} minutes.`;
    sendValidationCodeMail(email, message);

    res.json({ success: true, message: 'Code envoyé par email' });
  } catch (error) {
    logger.error('Erreur lors de la création du code :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * @openapi
 * /v2/validation/check-code:
 *   post:
 *     summary: Verify a submitted validation code
 *     tags:
 *       - Validation
 *     description: |
 *       Checks if the provided code for the given email is valid and not expired.
 *       Returns a token if the code is valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address linked to the verification code
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 description: Verification code sent by email
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Code is valid, returns a token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Code valide
 *                 token:
 *                   type: string
 *                   description: Token generated to confirm the code validity
 *                   example: "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890"
 *       400:
 *         description: Missing email or code in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email ou code manquant
 *       404:
 *         description: Code not found, expired, or incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Code de validation non trouvé ou expiré
 *       500:
 *         description: Server error during code verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur serveur
 */
router.post('/check-code', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email ou code manquant" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM verification_codes WHERE email = ? AND used = FALSE AND expires_at > NOW()`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Code de validation non trouvé ou expiré" });
    }

    const validEntry = rows.find(row => bcrypt.compareSync(code, row.code_hash));

    if (!validEntry) {
      return res.status(404).json({ error: "Code de validation incorrect" });
    }

    // Génère un token si pas déjà généré
    let token = validEntry.token;
    if (!token) {
      token = crypto.randomBytes(32).toString('hex');
      await pool.query(
        `UPDATE verification_codes SET token = ? WHERE id = ?`,
        [token, validEntry.id]
      );
    }

    res.json({ success: true, message: "Code valide", token });

  } catch (error) {
    console.error("Erreur lors de la vérification du code :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @openapi
 * /v2/validation/reset-password:
 *   post:
 *     summary: Reset user password with a valid token
 *     tags:
 *       - Validation
 *     description: |
 *       Permet à un utilisateur de réinitialiser son mot de passe
 *       en fournissant son email, un nouveau mot de passe, et un token de validation valide.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: Email de l'utilisateur
 *               password:
 *                 type: string
 *                 example: newStrongPassword123
 *                 description: Nouveau mot de passe (minimum 10 caractères)
 *               token:
 *                 type: string
 *                 description: Token de validation reçu par email
 *                 example: "a1b2c3d4e5f67890"
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Mot de passe mis à jour avec succès
 *       400:
 *         description: Paramètres manquants ou invalides, ou token invalide/expiré
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
 *                   example: Token invalide ou expiré
 *       404:
 *         description: Utilisateur non trouvé
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
 *                   example: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur interne
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
 *                   example: Erreur serveur
 */
router.post('/reset-password', async (req, res) => {
  const { password, email, token } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Email manquant ou invalide' });
  }
  if (!password || password.length < 10) {
    return res.status(400).json({ success: false, message: 'Mot de passe manquant ou invalide' });
  }
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, message: 'Token manquant ou invalide' });
  }

  try {
    const sqlCheckToken = `
      SELECT * FROM verification_codes 
      WHERE email = ? AND token = ? AND used = FALSE AND expires_at > NOW()
      LIMIT 1
    `;
    const [rows] = await pool.query(sqlCheckToken, [email, token]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
    }

    const length = 13;
    const salt = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').substring(0, length);
    const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');

    const sqlUpdateUser = `UPDATE User SET password = ?, salt = ? WHERE email = ?`;
    const [result] = await pool.query(sqlUpdateUser, [hashedPassword, salt, email]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const sqlUseToken = `UPDATE verification_codes SET used = TRUE WHERE email = ? AND token = ?`;
    await pool.query(sqlUseToken, [email, token]);

    res.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * @openapi
 * /v2/validation/logged/ask-code:
 *   post:
 *     summary: Request a verification code for the logged-in user's email
 *     tags:
 *       - Validation
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Envoie un code de vérification à l'adresse email de l'utilisateur authentifié.
 *       Le code expire au bout de 10 minutes.
 *     responses:
 *       200:
 *         description: Code de vérification envoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Code de vérification envoyé à l'adresse email
 *       500:
 *         description: Erreur serveur interne
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
 *                   example: Erreur serveur
 */
router.post('/logged/ask-code', verifyToken, async (req, res) => {
  const email = req.user.email;

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(`
      INSERT INTO verification_codes (email, code_hash, created_at, expires_at, used)
      VALUES (?, ?, NOW(), ?, FALSE)
    `, [email, codeHash, expiresAt]);

    await sendValidationCodeMail(email, code);

    res.json({ success: true, message: "Code de vérification envoyé à l'adresse email" });
  } catch (error) {
    console.error("Erreur /update/mail/check :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/**
 * @openapi
 * /v2/validation/logged/check-code:
 *   post:
 *     summary: Vérifie un code de validation pour l'utilisateur connecté
 *     tags:
 *       - Validation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *                 description: Code de validation à vérifier
 *     responses:
 *       200:
 *         description: Code valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Code valide
 *       400:
 *         description: Code incorrect ou données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Code incorrect
 *       404:
 *         description: Code non trouvé ou expiré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Code non trouvé ou expiré
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur serveur
 */
router.post('/logged/check-code', verifyToken, async (req, res) => {
  const { code } = req.body;
  const email = req.user.email;

  if (!code || !email) {
    return res.status(400).json({ error: "Email ou code manquant" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM verification_codes 
       WHERE email = ? AND used = FALSE AND expires_at > NOW()`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Code non trouvé ou expiré" });
    }

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const validEntry = rows.find(row => row.code_hash === codeHash);

    if (!validEntry) {
      return res.status(400).json({ error: "Code incorrect" });
    }

    res.json({ success: true, message: "Code valide"});
  } catch (error) {
    console.error("Erreur lors de la vérification du code :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @openapi
 * components:
 *   schemas:
 *     VerificationCode:
 *       type: object
 *       description: Represents a verification code sent to a user
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier of the verification code
 *           example: 123
 *         email:
 *           type: string
 *           format: email
 *           description: Email address associated with the verification code
 *           example: user@example.com
 *         pseudo:
 *           type: string
 *           nullable: true
 *           description: Optional username associated with the code
 *           example: user123
 *         code_hash:
 *           type: string
 *           description: SHA-256 hashed verification code
 *           example: "a3f5e6..."
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date and time the code was created
 *           example: "2025-06-20T12:34:56Z"
 *         expires_at:
 *           type: string
 *           format: date-time
 *           description: Date and time the code expires
 *           example: "2025-06-20T12:44:56Z"
 *         used:
 *           type: boolean
 *           description: Whether the code has been used or not
 *           example: false
 *         token:
 *           type: string
 *           nullable: true
 *           description: Optional token associated with the code for password reset
 *           example: "abcdef123456"
 *       required:
 *         - id
 *         - email
 *         - code_hash
 *         - created_at
 *         - expires_at
 *         - used
 */


export default router;