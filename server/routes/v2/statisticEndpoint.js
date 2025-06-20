import express from 'express';
import { verifyAdmin } from '../../middlewares/token-check.js';
import { verifyToken } from '../../middlewares/token-check.js';
import { pool } from '../../config/database.js';
import os from 'os';

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
 * /v2/stats/info:
 *   get:
 *     summary: Get general statistics and info about the API
 *     tags:
 *       - Stats
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Returns general information and statistics about the Maths à la Maison API server.
 *     responses:
 *       200:
 *         description: General API info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to the Maths à la Maison API"
 *                 version:
 *                   type: string
 *                   example: "v2"
 *                 description:
 *                   type: string
 *                   example: "This endpoint provides general statistic about the server."
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
 *       403:
 *         description: Forbidden – admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin access required"
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
router.get('/info', verifyToken, verifyAdmin, async (req, res) => {
    res.json({
        message: 'Welcome to the Maths à la Maison API',
        version: 'v2',
        description: 'This endpoint provides general statistic about the server.',
    });
});

/**
 * @openapi
 * /v2/stats/today-connection:
 *   get:
 *     summary: Get the number of user connections today
 *     tags:
 *       - Stats
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Returns the total number of user sessions with last login date equal to today.
 *     responses:
 *       200:
 *         description: Number of connections today
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 connectionsToday:
 *                   type: integer
 *                   example: 42
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
router.get('/today-connection', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [[{ count }]] = await pool.query(
      `SELECT COUNT(*) AS count
       FROM sessions
       WHERE DATE(last_login) = CURDATE()`
    );

    res.status(200).json({ connectionsToday: count });
  } catch (err) {
    console.error("❌ Error retrieving today's connection count:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @openapi
 * /v2/stats/server-stats:
 *   get:
 *     summary: Get detailed server statistics for today
 *     tags:
 *       - Stats
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     description: |
 *       Returns statistics including the number of user connections today grouped by hour and half-hour segment,
 *       total connections today, RAM usage details, Node.js version, and server uptime.
 *     responses:
 *       200:
 *         description: Server statistics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 connectionsToday:
 *                   type: integer
 *                   example: 120
 *                 connectionsByMinute:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       hour:
 *                         type: string
 *                         example: "14"
 *                       minute_segment:
 *                         type: string
 *                         example: "00"
 *                       connections_count:
 *                         type: integer
 *                         example: 15
 *                 ramUsed:
 *                   type: number
 *                   format: float
 *                   description: RAM used in GB
 *                   example: 3.5
 *                 ramTotal:
 *                   type: number
 *                   format: float
 *                   description: Total RAM in GB
 *                   example: 8.0
 *                 nodeVersion:
 *                   type: string
 *                   example: "v18.15.0"
 *                 uptime:
 *                   type: object
 *                   properties:
 *                     hours:
 *                       type: integer
 *                       example: 5
 *                     minutes:
 *                       type: integer
 *                       example: 32
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
router.get('/server-stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [connectionsByMinute] = await pool.query(
      `SELECT 
        DATE_FORMAT(last_login, '%H') AS hour,
        CASE 
            WHEN MINUTE(last_login) < 30 THEN '00' 
            ELSE '30' 
        END AS minute_segment,
        COUNT(DISTINCT refresh_token) AS connections_count
        FROM sessions
        WHERE DATE(last_login) = CURDATE()
        GROUP BY hour, minute_segment
        ORDER BY hour, minute_segment;
        `
    );

    const [[{ count: connectionsToday }]] = await pool.query(
      `SELECT COUNT(*) AS count FROM sessions WHERE DATE(last_login) = CURDATE()`
    );

    const ramTotal = os.totalmem() / (1024 ** 3);
    const ramFree = os.freemem() / (1024 ** 3);
    const ramUsed = ramTotal - ramFree;

    const nodeVersion = process.version;

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    res.json({
      connectionsToday,
      connectionsByMinute,
      ramUsed: Number(ramUsed.toFixed(2)),
      ramTotal: Number(ramTotal.toFixed(2)),
      nodeVersion,
      uptime: { hours, minutes },
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;