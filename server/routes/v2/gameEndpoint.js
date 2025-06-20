import express from 'express';
import { pool } from '../../config/database.js';
import { logger } from '../../config/logger.js';
import { winnerPoint } from '../../config/gameAttribute.js';
import { verifyToken } from '../../middlewares/token-check.js';

/**
 * Express Router instance for handling routing within the application.
 * This object will be used to define routes and their handlers for various HTTP methods.
 * 
 * @constant
 * @type {express.Router}
 */
const router = express.Router();

router.post('/finish', verifyToken, async (req, res) => {
  const email = req.user.email;

  try {
    const [result] = await pool.query(
      'UPDATE User SET point = point + ? WHERE email = ?',
      [winnerPoint, email]
    );

    if (result.affectedRows === 0) {
      logger.warn(`Aucun utilisateur trouvé avec l'email ${email}`);
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    logger.info(`${email} a gagné ${winnerPoint} points`);
    res.status(200).json({ message: "Points enregistrés", point: winnerPoint });
  } catch (error) {
    logger.error(`Erreur lors de l'attribution des points à ${email}: ${error.message}`);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;