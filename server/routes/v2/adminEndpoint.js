import express from 'express';
import { pool } from '../../config/database.js';
import { logger } from '../../config/logger.js';

import { verifyToken } from '../../middlewares/token-check.js';
import { verifyAdmin } from '../../middlewares/token-check.js';

import { sendApprovalMail, sendDisapprovalMail } from '../../services/mailTemplate.js';
import { sendHtmlMail } from '../../services/mailService.js';

const router = express.Router();

/**
 * @openapi
 * /v2/admin/check-access:
 *   get:
 *     summary: Check if the current user has admin access
 *     tags:
 *       - Admin
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       This endpoint checks whether the user has a valid JWT token and the "admin" role.
 *       Returns 200 if access is granted.
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
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
router.get('/check-access', verifyToken, verifyAdmin, async (req, res) => {
  try {
    logger.info(`Admin access granted to ${req.user.email}`);
    res.status(200).json({ message: 'Accès autorisé' });
  } catch (err) {
    logger.error('Erreur dans /check-access:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * @openapi
 * /v2/admin/getNonPremiumUser:
 *   get:
 *     summary: Retrieve all non-premium users who have never played a game
 *     tags:
 *       - Admin
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Returns a list of users who are not premium and have zero games played (`nombrePartie = 0`).
 *       This endpoint requires admin privileges.
 *     responses:
 *       200:
 *         description: List of non-premium users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 123
 *                   pseudo:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: johndoe@example.com
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error message
 */
router.get('/getNonPremiumUser', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, pseudo, email FROM User WHERE isPremium = 0 AND nombrePartie = 0`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /v2/admin/getAllUsers:
 *   get:
 *     summary: Retrieve a paginated list of users with optional filters
 *     tags:
 *       - Admin
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: "Page number for pagination (default: 1)"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter users by pseudo or email (optional)
 *       - in: query
 *         name: premium
 *         schema:
 *           type: boolean
 *         description: Filter users by premium status (true or false)
 *     description: |
 *       Returns a paginated list of users filtered optionally by search term and premium status.
 *       The number of users per page is fetched from the Settings table (default 10).
 *       Requires admin privileges.
 *     responses:
 *       200:
 *         description: Paginated list of users with metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 123
 *                       pseudo:
 *                         type: string
 *                         example: johndoe
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: johndoe@example.com
 *                       isPremium:
 *                         type: boolean
 *                         example: true
 *                       point:
 *                         type: integer
 *                         example: 1500
 *                       nombrePartie:
 *                         type: integer
 *                         example: 10
 *                       nombreVictoire:
 *                         type: integer
 *                         example: 7
 *                       photoDeProfil:
 *                         type: int
 *                         example: 1
 *                       last_login:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-20T19:45:00Z"
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 limit:
 *                   type: integer
 *                   example: 10
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error message
 */
router.get('/getAllUsers', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [settingsRows] = await pool.execute(
      `SELECT value FROM Settings WHERE keyName = ?`,
      ['users_per_page']
    );
    const limit = settingsRows.length ? parseInt(settingsRows[0].value, 10) : 10;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    const search = req.query.search?.trim() || null;
    const premium = req.query.premium === 'true' ? 1
                  : req.query.premium === 'false' ? 0
                  : null;

    const conditions = [];
    const params = [];

    if (search) {
      conditions.push(`(u.pseudo LIKE ? OR u.email LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
    }
    if (premium !== null) {
      conditions.push(`u.isPremium = ?`);
      params.push(premium);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM User u ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT u.id, u.pseudo, u.email, u.isPremium, u.point, u.nombrePartie,
              u.nombreVictoire, u.photoDeProfil,
              (SELECT MAX(s.last_login) FROM sessions s WHERE s.user_id = u.id) as last_login
       FROM User u
       ${whereClause}
       ORDER BY u.id
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({ users: rows, total, limit });
  } catch (error) {
    console.error("Erreur getAllUsers :", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /v2/admin/approveUser:
 *   post:
 *     summary: Approve a user by setting isPremium to true and send approval email
 *     tags:
 *       - Admin
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - email
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 123
 *                 description: User ID to approve
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: Email of the user to approve
 *               pseudo:
 *                 type: string
 *                 example: johndoe
 *                 description: Pseudo of the user (optional, for logging)
 *     responses:
 *       200:
 *         description: User approved and approval email sent successfully
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
 *                   example: User approved and mail sent
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: userId and email are required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to approve user
 *                 details:
 *                   type: string
 *                   example: Database error message
 */
router.post('/approveUser', verifyToken, verifyAdmin, async (req, res) => {
  const { id, email, pseudo } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'userId and email are required' });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE User SET isPremium = 1 WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`L'utilisateur ${pseudo} (${email}) a été approuvé par ${req.user.email}`);

    await sendApprovalMail(email, pseudo);

    res.json({ success: true, message: 'User approved and mail sent' });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Failed to approve user', details: error.message });
  }
});

/**
 * @openapi
 * /v2/admin/rejectUser:
 *   post:
 *     summary: Reject a user by deleting them and send rejection email
 *     tags:
 *       - Admin
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - email
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 123
 *                 description: User ID to reject
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: Email of the user to reject
 *               pseudo:
 *                 type: string
 *                 example: johndoe
 *                 description: Pseudo of the user (optional, for logging)
 *     responses:
 *       200:
 *         description: User rejected, deleted, and rejection email sent successfully
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
 *                   example: User rejected and deleted, mail sent
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: userId and email are required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to reject user
 *                 details:
 *                   type: string
 *                   example: Database error message
 */
router.post('/rejectUser', verifyToken, verifyAdmin, async (req, res) => {
  const { id, email, pseudo } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'userId and email are required' });
  }

  try {
    const [result] = await pool.execute(
      `DELETE FROM User WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`L'utilisateur ${pseudo} (${email}) a été désaprouvé par ${req.user.email}`);

    await sendDisapprovalMail(email, pseudo);

    res.json({ success: true, message: 'User rejected and deleted, mail sent' });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ error: 'Failed to reject user', details: error.message });
  }
});

/**
 * @openapi
 * /v2/admin/update-premium:
 *   post:
 *     summary: Update a user's premium status
 *     tags:
 *       - Admin
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPremiumState
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: Email of the user to update
 *               newPremiumState:
 *                 type: boolean
 *                 example: true
 *                 description: New premium status to set (true or false)
 *     responses:
 *       200:
 *         description: Premium status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Premium status updated for user@example.com
 *       400:
 *         description: Bad request – missing email or newPremiumState
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email and newPremiumState are required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       403:
 *         description: Forbidden – cannot change premium status of an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cannot change premium status of an administrator
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
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.post('/update-premium', verifyToken, verifyAdmin, async (req, res) => {
  const { email, newPremiumState } = req.body;

  if (!email || newPremiumState === undefined) {
    return res.status(400).json({ error: "Email et newPremiumState requis" });
  }

  try {
    const [users] = await pool.execute(
      'SELECT id, isPremium, specialRole FROM User WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const user = users[0];

    if (user.specialRole === 'admin') {
      return res.status(403).json({ error: "Impossible de modifier le statut premium d’un administrateur." });
    }

    await pool.execute(
      'UPDATE User SET isPremium = ? WHERE email = ?',
      [newPremiumState, email]
    );

    res.status(200).json({ message: `Statut premium mis à jour pour ${email}` });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut premium :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
***********************************
* Questions
***********************************
*/

/**
 * @openapi
 * /v2/admin/getAllQuestions:
 *   get:
 *     summary: Retrieve a paginated list of questions
 *     tags:
 *       - Admin
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: "Page number for pagination (default: 1)"
 *     description: |
 *       Returns a paginated list of questions with details including optional images encoded in base64.
 *       The number of questions per page is fetched from the Settings table (default 10).
 *       Requires admin privileges.
 *     responses:
 *       200:
 *         description: Paginated list of questions with metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 42
 *                       typeQuestion:
 *                         type: string
 *                         example: "multiple-choice"
 *                       question:
 *                         type: string
 *                         example: "What is 2 + 2?"
 *                       typeReponse:
 *                         type: string
 *                         example: "single"
 *                       reponse:
 *                         type: string
 *                         example: "4"
 *                       correction:
 *                         type: string
 *                         example: "The sum of 2 and 2 is 4."
 *                       image:
 *                         type: string
 *                         format: byte
 *                         nullable: true
 *                         description: Base64 encoded JPEG image or null if none
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 limit:
 *                   type: integer
 *                   example: 10
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error message
 */
router.get('/getAllQuestions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [settingsRows] = await pool.execute(
      `SELECT value FROM Settings WHERE keyName = ?`,
      ['questions_per_page']
    );
    const limit = settingsRows.length ? parseInt(settingsRows[0].value, 10) : 10;
    const page = parseInt(req.query.page, 10);
    const currentPage = (Number.isInteger(page) && page > 0) ? page : 1;
    const offset = (currentPage - 1) * limit;

    const [countResult] = await pool.execute(`SELECT COUNT(*) as total FROM Questions`);
    const total = countResult[0].total;

    const [rows] = await pool.execute(
      `SELECT id, typeQuestion, question, typeReponse, reponse, correction, image_data
       FROM Questions
       ORDER BY id
       LIMIT ${limit} OFFSET ${offset}`
    );

    const questions = rows.map((row) => {
      let imageBase64 = null;
      if (row.image_data) {
        imageBase64 = `data:image/jpeg;base64,${Buffer.from(row.image_data).toString("base64")}`;
      }

      return {
        id: row.id,
        typeQuestion: row.typeQuestion,
        question: row.question,
        typeReponse: row.typeReponse,
        reponse: row.reponse,
        correction: row.correction,
        image: imageBase64,
      };
    });

    res.json({ questions, total, limit });
  } catch (error) {
    console.error("Erreur getAllQuestions :", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /v2/admin/question:
 *   post:
 *     summary: Add a new question to the database
 *     tags:
 *       - Admin
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeQuestion
 *               - question
 *               - typeReponse
 *               - reponse
 *             properties:
 *               typeQuestion:
 *                 type: string
 *                 example: multiple-choice
 *                 description: Type of the question
 *               question:
 *                 type: string
 *                 example: What is 2 + 2?
 *                 description: The question text
 *               typeReponse:
 *                 type: string
 *                 example: single
 *                 description: Type of the response
 *               reponse:
 *                 type: string
 *                 example: 4
 *                 description: The correct answer
 *               correction:
 *                 type: string
 *                 example: The sum of 2 and 2 is 4.
 *                 description: Explanation or correction text (optional)
 *               image_data:
 *                 type: string
 *                 format: base64
 *                 example: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
 *                 description: Base64 encoded image data (optional)
 *     responses:
 *       201:
 *         description: Question successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question added
 *                 insertedId:
 *                   type: integer
 *                   example: 42
 *       400:
 *         description: Bad request – missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
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
router.post('/question', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      typeQuestion,
      question,
      typeReponse,
      reponse,
      correction,
      image_data,
    } = req.body;

    if (!question || !typeQuestion || !typeReponse || !reponse) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    let imageBuffer = null;
    if (image_data) {
      const base64String = image_data.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64String, "base64");
    }

    const [result] = await pool.execute(
      `INSERT INTO Questions (typeQuestion, question, typeReponse, reponse, correction, image_data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [typeQuestion, question, typeReponse, reponse, correction || "", imageBuffer]
    );

    res.status(201).json({ message: "Question ajoutée", insertedId: result.insertId });
  } catch (error) {
    console.error("Erreur ajout question:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
***********************************
* Settings
***********************************
*/

/**
 * @openapi
 * /v2/admin/settings/users_per_page:
 *   get:
 *     summary: Get the "users_per_page" setting value
 *     tags:
 *       - Admin
 *       - Settings
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Returns the current value of the "users_per_page" setting used for pagination.
 *       Requires admin privileges.
 *     responses:
 *       200:
 *         description: Successfully retrieved users_per_page setting
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users_per_page:
 *                   type: integer
 *                   example: 10
 *       404:
 *         description: Setting not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameter not found
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error message
 */
router.get('/settings/users_per_page', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT value FROM Settings WHERE keyName = ?`,
      ['users_per_page']
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Paramètre non trouvé" });
    }
    res.json({ users_per_page: parseInt(rows[0].value) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /v2/admin/settings/users_per_page:
 *   post:
 *     summary: Update the "users_per_page" setting value
 *     tags:
 *       - Admin
 *       - Settings
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users_per_page
 *             properties:
 *               users_per_page:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *                 description: Number of users per page for pagination
 *     responses:
 *       200:
 *         description: Successfully updated the setting
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users_per_page:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Bad request – invalid or missing users_per_page value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid value
 *       404:
 *         description: Setting not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameter not found
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error message
 */
router.post('/settings/users_per_page', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { users_per_page } = req.body;
    if (!users_per_page || isNaN(users_per_page) || users_per_page <= 0) {
      return res.status(400).json({ error: "Valeur invalide" });
    }

    const [result] = await pool.execute(
      `UPDATE Settings SET value = ? WHERE keyName = ?`,
      [users_per_page.toString(), 'users_per_page']
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paramètre non trouvé" });
    }

    res.json({ success: true, users_per_page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /v2/admin/settings/questions_per_page:
 *   get:
 *     summary: Get the "questions_per_page" setting value
 *     tags:
 *       - Admin
 *       - Settings
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Returns the current value of the "questions_per_page" setting used for pagination.
 *       Requires admin privileges.
 *     responses:
 *       200:
 *         description: Successfully retrieved questions_per_page setting
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions_per_page:
 *                   type: integer
 *                   example: 10
 *       404:
 *         description: Setting not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameter not found
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error message
 */
router.get('/settings/questions_per_page', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT value FROM Settings WHERE keyName = ?`,
      ['questions_per_page']
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Paramètre non trouvé" });
    }
    res.json({ questions_per_page: parseInt(rows[0].value) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /v2/admin/settings/questions_per_page:
 *   post:
 *     summary: Update the "questions_per_page" setting value
 *     tags:
 *       - Admin
 *       - Settings
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questions_per_page
 *             properties:
 *               questions_per_page:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *                 description: Number of questions per page for pagination
 *     responses:
 *       200:
 *         description: Successfully updated the setting
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questions_per_page:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Bad request – invalid or missing questions_per_page value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid value
 *       404:
 *         description: Setting not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameter not found
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error message
 */
router.post('/settings/questions_per_page', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { questions_per_page } = req.body;
    if (!questions_per_page || isNaN(questions_per_page) || questions_per_page <= 0) {
      return res.status(400).json({ error: "Valeur invalide" });
    }

    const [result] = await pool.execute(
      `UPDATE Settings SET value = ? WHERE keyName = ?`,
      [questions_per_page.toString(), 'questions_per_page']
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paramètre non trouvé" });
    }

    res.json({ success: true, questions_per_page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
***********************************
* Email
***********************************
*/

/**
 * @openapi
 * /v2/admin/send-email:
 *   post:
 *     summary: Send a personalized HTML email to all users
 *     tags:
 *       - Admin
 *       - Email
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - content
 *             properties:
 *               subject:
 *                 type: string
 *                 example: "Monthly Newsletter"
 *                 description: Subject of the email
 *               content:
 *                 type: string
 *                 example: "<h1>Hello {{pseudo}}</h1><p>Thanks for being with us!</p>"
 *                 description: HTML content with placeholders to personalize per user
 *     responses:
 *       200:
 *         description: Emails sent with individual results per user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: done
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: user@example.com
 *                       status:
 *                         type: string
 *                         enum: [success, error]
 *                         example: success
 *                       error:
 *                         type: string
 *                         nullable: true
 *                         example: SMTP connection failed
 *       400:
 *         description: Bad request – missing subject or content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Subject and content are required
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.post('/send-email', verifyToken, verifyAdmin, async (req, res) => {
  const { subject, content } = req.body;

  if (!subject || !content) {
    return res.status(400).json({ error: "Subject and content are required" });
  }

  try {
    const [users] = await pool.execute(`
      SELECT pseudo, email, point, isPremium, nombrePartie, nombreVictoire, specialRole FROM User
    `);

    const result = [];

    for (const user of users) {
      const personalizedHtml = personalizeHtml(content, user);

      try {
        await sendHtmlMail(user.email, subject, personalizedHtml);
        result.push({ email: user.email, status: 'success' });
      } catch (error) {
        logger.error(`Error sending email to ${user.email}:`, error);
        result.push({ email: user.email, status: 'error', error: error.message });
      }
    }

    res.json({ status: 'done', result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

function personalizeHtml(template, user) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (key in user) {
      const value = user[key];
      if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
      return String(value ?? '');
    }
    return `{${key}}`;
  });
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Setting:
 *       type: object
 *       description: Configuration key-value pair for application settings
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier of the setting
 *           example: 1
 *         keyName:
 *           type: string
 *           description: The name/key of the setting
 *           example: "users_per_page"
 *         value:
 *           type: string
 *           description: The value assigned to the key
 *           example: "10"
 *       required:
 *         - id
 *         - keyName
 *         - value
 */

export default router;