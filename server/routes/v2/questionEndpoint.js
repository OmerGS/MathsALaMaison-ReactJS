import express from 'express';
import { pool } from '../../config/database.js';
import { logger } from '../../config/logger.js';
import { verifyToken } from '../../middlewares/token-check.js';

/**
 * Express Router instance for handling routing within the application.
 * This object will be used to define routes and their handlers for various HTTP methods.
 * 
 * @constant
 * @type {express.Router}
 */
const router = express.Router();

/**
 * @openapi
 * /v2/question/questions:
 *   get:
 *     summary: Retrieve all questions with optional base64-encoded images
 *     tags:
 *       - Question
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Returns the list of all questions from the database.  
 *       Each question includes an `image_data` field with the image encoded in base64 if available.
 *     responses:
 *       200:
 *         description: List of questions with base64 encoded images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   typeQuestion:
 *                     type: string
 *                     example: "multiple-choice"
 *                   question:
 *                     type: string
 *                     example: "What is 2 + 2?"
 *                   typeReponse:
 *                     type: string
 *                     example: "number"
 *                   reponse:
 *                     type: string
 *                     example: "4"
 *                   correction:
 *                     type: string
 *                     example: "2 + 2 equals 4"
 *                   image_data:
 *                     type: string
 *                     nullable: true
 *                     example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *       401:
 *         description: Unauthorized – missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Refresh token missing or access token invalid"
 *       500:
 *         description: Internal server error fetching questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch questions"
 */
router.get('/questions', verifyToken, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Questions');
      
      const questionsWithBase64Images = rows.map((row) => {
        let base64Image = '';
        if (row.image_data) {
          base64Image = `data:image/jpeg;base64,${row.image_data.toString('base64')}`;
        }
        return { ...row, image_data: base64Image };
      });
  
      res.json(questionsWithBase64Images);
    } catch (error) {
      logger.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

/**
 * @openapi
 * /v2/question/random:
 *   get:
 *     summary: Retrieve one random question filtered by allowed response types
 *     tags:
 *       - Question
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Returns a single random question whose `typeReponse` is one of the allowed types: QCM, VF, RDS, RCV.
 *       The question includes an `image_data` field with the image encoded in base64 if available.
 *     responses:
 *       200:
 *         description: Random question found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 typeQuestion:
 *                   type: string
 *                   example: "multiple-choice"
 *                 question:
 *                   type: string
 *                   example: "What is 2 + 2?"
 *                 typeReponse:
 *                   type: string
 *                   example: "QCM"
 *                 reponse:
 *                   type: string
 *                   example: "4"
 *                 correction:
 *                   type: string
 *                   example: "2 + 2 equals 4"
 *                 image_data:
 *                   type: string
 *                   nullable: true
 *                   example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *       404:
 *         description: No valid question found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No valid question found"
 *       401:
 *         description: Unauthorized – missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Refresh token missing or access token invalid"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.get('/random', verifyToken, async (req, res) => {
  try {
    const allowedTypes = ['QCM', 'VF', 'RDS', 'RCV'];

    const placeholders = allowedTypes.map(() => '?').join(', ');
    const sql = `SELECT * FROM Questions WHERE typeReponse IN (${placeholders}) ORDER BY RAND() LIMIT 1`;

    const [rows] = await pool.query(sql, allowedTypes);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Aucune question valide trouvée' });
    }

    const row = rows[0];
    let base64Image = '';
    if (row.image_data) {
      base64Image = `data:image/jpeg;base64,${row.image_data.toString('base64')}`;
    }

    res.json({ ...row, image_data: base64Image });
  } catch (error) {
    logger.error('Erreur lors de la récupération de la question aléatoire :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * @openapi
 * /v2/question/random/category:
 *   get:
 *     summary: Retrieve one random question by category and allowed response types
 *     tags:
 *       - Question
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category (typeQuestion) of the question to retrieve
 *         example: "math"
 *     description: |
 *       Returns a single random question filtered by the specified category (`typeQuestion`) and allowed response types (QCM, VF, RDS, RCV).
 *       The question includes an `image_data` field with the image encoded in base64 if available.
 *     responses:
 *       200:
 *         description: Random question found for the given category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 typeQuestion:
 *                   type: string
 *                   example: "math"
 *                 question:
 *                   type: string
 *                   example: "What is 2 + 2?"
 *                 typeReponse:
 *                   type: string
 *                   example: "QCM"
 *                 reponse:
 *                   type: string
 *                   example: "4"
 *                 correction:
 *                   type: string
 *                   example: "2 + 2 equals 4"
 *                 image_data:
 *                   type: string
 *                   nullable: true
 *                   example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *       400:
 *         description: Missing category parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category parameter is required"
 *       404:
 *         description: No question found for this category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No question found for this category"
 *       401:
 *         description: Unauthorized – missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Refresh token missing or access token invalid"
 *       500:
 *         description: Internal server error fetching question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch random question by category"
 */
router.get('/random/category', verifyToken, async (req, res) => {
  try {
    const allowedTypes = ['QCM', 'VF', 'RDS', 'RCV'];
    const category = req.query.category;

    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM Questions WHERE typeQuestion = ? AND typeReponse IN (?, ?, ?, ?) ORDER BY RAND() LIMIT 1',
      [category, ...allowedTypes]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No question found for this category' });
    }

    const row = rows[0];
    let base64Image = '';
    if (row.image_data) {
      base64Image = `data:image/jpeg;base64,${row.image_data.toString('base64')}`;
    }

    res.json({ ...row, image_data: base64Image });
  } catch (error) {
    logger.error('Error fetching random question by category:', error);
    res.status(500).json({ error: 'Failed to fetch random question by category' });
  }
});

/**
 * @openapi
 * /v2/question/paginated:
 *   get:
 *     summary: Retrieve paginated list of questions
 *     tags:
 *       - Question
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: question_number
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of questions per page (default is 10)
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination (default is 1)
 *         example: 1
 *     description: |
 *       Returns a paginated list of questions with base64 encoded images if available.
 *     responses:
 *       200:
 *         description: Paginated list of questions
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
 *                         example: 1
 *                       typeQuestion:
 *                         type: string
 *                         example: "multiple-choice"
 *                       question:
 *                         type: string
 *                         example: "What is 2 + 2?"
 *                       typeReponse:
 *                         type: string
 *                         example: "QCM"
 *                       reponse:
 *                         type: string
 *                         example: "4"
 *                       correction:
 *                         type: string
 *                         example: "2 + 2 equals 4"
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *                 total:
 *                   type: integer
 *                   example: 120
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
 *                 error:
 *                   type: string
 *                   example: "Refresh token missing or access token invalid"
 *       500:
 *         description: Internal server error fetching questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch questions"
 */
router.get('/paginated', verifyToken, async (req, res) => {
  try {

    const numberOfQuestion = req.query.question_number;
    const limit = numberOfQuestion ? parseInt(numberOfQuestion, 10) : 10;
    
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
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       description: A question with its type, answer, correction, and optional image
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier of the question
 *           example: 123
 *         typeQuestion:
 *           type: string
 *           description: Type or category of the question
 *           example: "multiple choice"
 *         question:
 *           type: string
 *           description: Text of the question
 *           example: "What is 2 + 2?"
 *         typeReponse:
 *           type: string
 *           description: Type of the expected answer
 *           example: "number"
 *         reponse:
 *           type: string
 *           description: The correct answer
 *           example: "4"
 *         correction:
 *           type: string
 *           description: Explanation or correction text
 *           example: "Adding 2 and 2 results in 4."
 *         image_data:
 *           type: string
 *           format: byte
 *           description: Base64 encoded image data related to the question (optional)
 *       required:
 *         - id
 *         - question
 *         - reponse
 */

export default router;