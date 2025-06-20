import express from 'express';
import crypto from 'crypto';
import { pool } from '../../config/database.js';
import cookie from 'cookie';
import { logger } from '../../config/logger.js';
import { logoutOtherDevices } from './authEndpoints.js';
import { verifyToken } from '../../middlewares/token-check.js';
import { sendPasswordChangedMail, sendValidationCodeMail } from '../../services/mailTemplate.js';
import { logDev } from '../../services/logDev.js';

const router = express.Router();

/**
 * @openapi
 * /v2/user/me:
 *   post:
 *     summary: Get the current authenticated user's full information
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       This endpoint returns all information stored in the database for the currently authenticated user.
 *     responses:
 *       200:
 *         description: User found and data returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized – invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token missing or access token invalid
 *       404:
 *         description: User not found in the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error during user lookup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.post('/me', verifyToken, async (req, res) => {
  let userId = req.user.userId;

  logDev("Payload JWT:", req.user);

  try {
    const [rows] = await pool.execute('SELECT * FROM User WHERE id = ?', [userId]);

    if (rows.length === 0) {
      logDev(`Utilisateur non trouvé pour le id ${userId}`);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(rows[0]);
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * @openapi
 * /v2/user/check-access:
 *   get:
 *     summary: Check if the user has valid access
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Verifies that the user is authenticated with a valid JWT token.
 *       Returns 200 if the token is valid.
 *     responses:
 *       200:
 *         description: Access granted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access granted
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
router.get('/check-access', verifyToken, async (req, res) => {
    res.status(200).json({ message: 'Accès autorisé' });
});

/**
 * @openapi
 * /v2/user/updatePicture:
 *   post:
 *     summary: Update the authenticated user's profile picture
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Updates the `photoDeProfil` field of the currently authenticated user.
 *       The client must provide the `idPicture`, which corresponds to a predefined image ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPicture:
 *                 type: integer
 *                 description: ID of the new profile picture
 *                 example: 3
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 affectedRows:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *       401:
 *         description: Unauthorized – token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token missing or access token invalid
 *       500:
 *         description: Server error while updating profile picture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update profile picture
 *                 details:
 *                   type: string
 *                   example: SQL error message
 */
router.post('/updatePicture', verifyToken, async (req, res) => {
  let email = req.user.email;
  const { idPicture } = req.body;

  try {
    const [result] = await pool.execute(
      `UPDATE User SET photoDeProfil = ? WHERE email = ?`,
      [idPicture, email]
    );

    res.json({ success: true, affectedRows: result.affectedRows, email });
  } catch (error) {
    logger.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture', details: error.message });
  }
});

/**
 * @openapi
 * /v2/user/update/password:
 *   post:
 *     summary: Update the authenticated user's password
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Allows a logged-in user to change their password.
 *       Requires the current password (`oldPassword`) and a new password (`newPassword`) with a minimum length of 8 characters.
 *       Also logs out all other active sessions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password
 *                 example: "myOldPassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: New password (minimum 8 characters)
 *                 example: "myNewSecurePassword456"
 *     responses:
 *       200:
 *         description: Password updated successfully
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
 *                   example: Password updated successfully
 *       400:
 *         description: Bad request – invalid input or missing fields
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
 *                   example: Invalid passwords
 *       403:
 *         description: Forbidden – incorrect old password
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
 *                   example: Incorrect old password
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
 *                   example: User not found
 *       500:
 *         description: Server error during password update
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
 *                   example: Server error
 */
router.post('/update/password', verifyToken, async (req, res) => {
  const email = req.user.email;
  const user_id = req.user.userId;
  const { oldPassword, newPassword } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Email manquant ou invalide' });
  }

  if (!oldPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'Mots de passe invalides' });
  }

  try {
    const [rows] = await pool.query(`SELECT pseudo, password, salt FROM User WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const user = rows[0];

    const oldHash = crypto
      .createHash('sha256')
      .update(oldPassword + user.salt)
      .digest('hex');

    if (oldHash !== user.password) {
      return res.status(403).json({ success: false, message: 'Ancien mot de passe incorrect' });
    }

    const newSalt = crypto.randomBytes(8).toString('hex');
    const newHash = crypto
      .createHash('sha256')
      .update(newPassword + newSalt)
      .digest('hex');

    await pool.query(
      `UPDATE User SET password = ?, salt = ? WHERE email = ?`,
      [newHash, newSalt, email]
    );

    const cookies = cookie.parse(req.headers.cookie || '');
    const currentRefreshToken = cookies.refreshToken;

    if (currentRefreshToken) {
      await logoutOtherDevices(user_id, currentRefreshToken);
    }

    sendPasswordChangedMail(email, user.pseudo);

    res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * @openapi
 * /v2/user/update/mail/ask:
 *   post:
 *     summary: Initiate email change request for the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Starts the process to change the user's email address.
 *       The user must provide their current password and a new email.
 *       A verification code will be sent to the new email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - newEmail
 *             properties:
 *               password:
 *                 type: string
 *                 description: Current account password
 *                 example: "myCurrentPassword123"
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 description: New email address to verify
 *                 example: "newaddress@example.com"
 *     responses:
 *       200:
 *         description: Verification code sent to the new email address
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
 *                   example: Code sent to email address
 *       400:
 *         description: Invalid email format or missing fields
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
 *                   example: Invalid email
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
 *                   example: Incorrect password
 *       404:
 *         description: User not found in database
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
 *                   example: User not found
 *       409:
 *         description: Email already in use
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
 *                   example: Email already in use
 *       500:
 *         description: Internal server error during request
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
 *                   example: Server error
 */
router.post('/update/mail/ask', verifyToken, async (req, res) => {
  const { password, newEmail } = req.body;
  const userId = req.user.userId;

  if (!newEmail || typeof newEmail !== "string") {
    return res.status(400).json({ success: false, message: "Email invalide" });
  }

  try {
    const [users] = await pool.query("SELECT * FROM User WHERE id = ?", [userId]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }

    const hashedPassword = crypto.createHash('sha256').update(password + user.salt).digest('hex');
    if (hashedPassword !== user.password) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    const [existing] = await pool.query("SELECT id FROM User WHERE email = ?", [newEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Email déjà utilisé" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(`
      INSERT INTO verification_codes (email, code_hash, created_at, expires_at, used)
      VALUES (?, ?, NOW(), ?, FALSE)
    `, [newEmail, codeHash, expiresAt]);

    await sendValidationCodeMail(newEmail, code);

    res.json({ success: true, message: "Code de vérification envoyé à l'adresse email" });
  } catch (error) {
    console.error("Erreur /update/mail/check :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/**
 * @openapi
 * /v2/user/update/mail/validate:
 *   post:
 *     summary: Validate and complete email address change for the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Validates the 6-digit verification code received by email and updates the user's email address if the code is correct and not expired.
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
 *                 description: 6-digit verification code sent to the new email address
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email successfully updated
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
 *                   example: Email address updated successfully
 *       400:
 *         description: Invalid or expired verification code
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
 *                   example: Invalid or expired code
 *       404:
 *         description: User not found during email update
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
 *                   example: User not found
 *       500:
 *         description: Internal server error during email validation
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
 *                   example: Server error
 */
router.post('/update/mail/validate', verifyToken, async (req, res) => {
  const { code } = req.body;
  const userId = req.user.userId;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, message: "Code requis" });
  }

  try {
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    const [rows] = await pool.query(`
      SELECT * FROM verification_codes
      WHERE code_hash = ? AND used = FALSE AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `, [codeHash]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Code invalide ou expiré" });
    }

    const { email } = rows[0];

    const [update] = await pool.query("UPDATE User SET email = ? WHERE id = ?", [email, userId]);

    if (update.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }

    await pool.query("UPDATE verification_codes SET used = TRUE WHERE code_hash = ?", [codeHash]);

    res.json({ success: true, message: "Adresse email mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur /update/mail/validate :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/**
 * @openapi
 * /v2/user/update/pseudo/ask:
 *   post:
 *     summary: Request pseudo change for the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Starts the process to change the user's pseudo.
 *       The user must provide their current password and a new pseudo.
 *       A 6-digit verification code will be sent by email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - newPseudo
 *             properties:
 *               password:
 *                 type: string
 *                 description: Current password of the user
 *                 example: "currentPassword123"
 *               newPseudo:
 *                 type: string
 *                 description: Desired new pseudo
 *                 example: "newUserPseudo"
 *     responses:
 *       200:
 *         description: Verification code sent to user's email
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
 *                   example: Code sent to email address
 *       400:
 *         description: Missing or invalid fields
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
 *                   example: Invalid pseudo
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
 *                   example: Incorrect password
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
 *                   example: User not found
 *       409:
 *         description: Pseudo already in use
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
 *                   example: Pseudo already used
 *       500:
 *         description: Server error during pseudo change request
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
 *                   example: Server error
 */
router.post('/update/pseudo/ask', verifyToken, async (req, res) => {
  const { password, newPseudo } = req.body;
  const userId = req.user.userId;
  const email = req.user.email;

  if (!newPseudo || typeof newPseudo !== "string") {
    return res.status(400).json({ success: false, message: "Pseudo invalide" });
  }

  try {
    const [users] = await pool.query("SELECT * FROM User WHERE id = ?", [userId]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }

    const hashedPassword = crypto.createHash('sha256').update(password + user.salt).digest('hex');
    if (hashedPassword !== user.password) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    const [existing] = await pool.query("SELECT id FROM User WHERE pseudo = ?", [newPseudo]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Pseudo déjà utilisé" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(`
      INSERT INTO verification_codes (email, pseudo, code_hash, created_at, expires_at, used)
      VALUES (?, ?, ?, NOW(), ?, FALSE)
    `, [email, newPseudo, codeHash, expiresAt]);

    await sendValidationCodeMail(email, code);

    res.json({ success: true, message: "Code de vérification envoyé à l'adresse email" });
  } catch (error) {
    console.error("Erreur /update/pseudo/ask :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/**
 * @openapi
 * /v2/user/update/pseudo/validate:
 *   post:
 *     summary: Validate and complete pseudo change for the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Validates the 6-digit verification code received by email and updates the user's pseudo if the code is valid and not expired.
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
 *                 description: 6-digit verification code received by email
 *                 example: "654321"
 *     responses:
 *       200:
 *         description: Pseudo successfully updated
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
 *                   example: Pseudo mis à jour avec succès
 *       400:
 *         description: Invalid or expired code, or missing pseudo in record
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
 *                   example: Code invalide ou expiré
 *       404:
 *         description: User not found during pseudo update
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
 *                   example: Utilisateur introuvable
 *       500:
 *         description: Internal server error during pseudo validation
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
router.post('/update/pseudo/validate', verifyToken, async (req, res) => {
  const { code } = req.body;
  const userId = req.user.userId;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, message: "Code requis" });
  }

  try {
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    const [rows] = await pool.query(`
      SELECT * FROM verification_codes
      WHERE code_hash = ? AND used = FALSE AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `, [codeHash]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Code invalide ou expiré" });
    }

    const { pseudo } = rows[0];
    if (!pseudo) {
      return res.status(400).json({ success: false, message: "Pseudo non trouvé dans le code" });
    }

    const [update] = await pool.query("UPDATE User SET pseudo = ? WHERE id = ?", [pseudo, userId]);

    if (update.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }

    await pool.query("UPDATE verification_codes SET used = TRUE WHERE code_hash = ?", [codeHash]);

    res.json({ success: true, message: "Pseudo mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur /update/pseudo/validate :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

/**
 * @openapi
 * /v2/user/users:
 *   get:
 *     summary: Get a list of users sorted by a specified field
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Retrieves up to 50 users sorted descendingly by one of the allowed fields.
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [point, nombreVictoire, nombrePartie]
 *         required: true
 *         description: Field to sort users by (must be one of "point", "nombreVictoire", or "nombrePartie")
 *     responses:
 *       200:
 *         description: List of users sorted by the specified field
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pseudo:
 *                     type: string
 *                     example: user123
 *                   point:
 *                     type: integer
 *                     example: 2500
 *                   nombreVictoire:
 *                     type: integer
 *                     example: 15
 *                   nombrePartie:
 *                     type: integer
 *                     example: 20
 *                   photoDeProfil:
 *                     type: integer
 *                     example: 1
 *       400:
 *         description: Invalid sortBy parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid sortBy parameter. Allowed values: point, nombreVictoire, nombrePartie"
 *       500:
 *         description: Server error while fetching users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch users
 */
router.get('/users', verifyToken, async function(req, res) {
  try {
    const validSortBy = ['point', 'nombreVictoire', 'nombrePartie'];
    const sortBy = req.query.sortBy;

    if (!validSortBy.includes(sortBy)) {
      return res.status(400).json({ error: `Invalid sortBy parameter. Allowed values: ${validSortBy.join(', ')}` });
    }

    const limit = 50;

    const query = `
      SELECT pseudo, point, nombreVictoire, nombrePartie, photoDeProfil
      FROM User
      ORDER BY ?? DESC
      LIMIT ?
    `;

    const [rows] = await pool.query(query, [sortBy, limit]);
    res.json(rows);
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


/* SCHEMA OF USER */ 
/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Represents a user with their stats and profile picture
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier of the user
 *           example: 1
 *         pseudo:
 *           type: string
 *           maxLength: 16
 *           description: The unique nickname of the user
 *           example: "user123"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "user123@example.com"
 *         point:
 *           type: integer
 *           minimum: 0
 *           description: Total points earned by the user
 *           example: 2500
 *         nombreVictoire:
 *           type: integer
 *           minimum: 0
 *           description: Number of victories won by the user
 *           example: 15
 *         nombrePartie:
 *           type: integer
 *           minimum: 0
 *           description: Total number of games played by the user
 *           example: 20
 *         photoDeProfil:
 *           type: integer
 *           description: Profile picture ID (used to build image URL)
 *           example: 1
 *         isPremium:
 *           type: boolean
 *           description: Whether the user has premium access
 *           example: true
 *         specialRole:
 *           type: string
 *           enum: [admin, user]
 *           description: Role of the user
 *           example: "user"
 *       required:
 *         - id
 *         - pseudo
 *         - email
 *         - point
 *         - nombreVictoire
 *         - nombrePartie
 *         - photoDeProfil
 *         - isPremium
 *         - specialRole
 */

export default router;