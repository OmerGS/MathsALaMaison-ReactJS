import { logger } from '../config/logger.js';
import { pool } from '../config/database.js';

/**
 * Adds points to a player's score in the database. The points are added to the current score of the player
 * identified by their pseudo.
 * 
 * @async
 * @function
 * @param {string} pseudo - The pseudo of the player whose score is being updated.
 * @param {number} winnerPoint - The number of points to be added to the player's score.
 * @returns {Promise<void>} Resolves when the operation is complete.
 */
export async function addPoint(pseudo, winnerPoint) {
    try {
        const connection = await pool.getConnection();

        const query = 'UPDATE User SET point = point + ? WHERE pseudo = ?';
        const [results] = await connection.execute(query, [winnerPoint, pseudo]); 

        if (results.affectedRows > 0) {
            logger.info(`Le score du joueur ${pseudo} a été mis à jour.`);
        } else {
            logger.warn(`Aucun joueur trouvé avec le pseudo ${pseudo}.`);
        }

        connection.release();
    } catch (err) {
        logger.warning('Erreur lors de la mise à jour du score:', err);
    }
}

/**
 * Increments the number of victories for a player in the database.
 * The number of victories for the player identified by their pseudo is increased by 1.
 * 
 * @async
 * @function
 * @param {string} pseudo - The pseudo of the player whose number of victories is being updated.
 * @returns {Promise<void>} Resolves when the operation is complete.
 */
export async function addVictory(pseudo) {
    try {
        const connection = await pool.getConnection();

        const query = 'UPDATE User SET nombreVictoire = nombreVictoire + 1 WHERE pseudo = ?';
        const [results] = await connection.execute(query, [pseudo]); 

        if (results.affectedRows > 0) {
            logger.info(`Le nombre de partie du joueur ${pseudo} a été mis à jour.`);
        } else {
            logger.warn(`Aucun joueur trouvé avec le pseudo ${pseudo}.`);
        }

        connection.release();
    } catch (err) {
        logger.warning('Erreur lors de la mise à jour du score:', err);
    }
}

/**
 * Increments the number of games played by a player in the database.
 * The number of games played for the player identified by their pseudo is increased by 1.
 * 
 * @async
 * @function
 * @param {string} pseudo - The pseudo of the player whose number of games played is being updated.
 * @returns {Promise<void>} Resolves when the operation is complete.
 */
export async function addPlayedGame(pseudo) {
    try {
        const connection = await pool.getConnection();

        const query = 'UPDATE User SET nombrePartie = nombrePartie + 1 WHERE pseudo = ?';
        const [results] = await connection.execute(query, [pseudo]); 

        if (results.affectedRows > 0) {
            logger.info(`Le nombre de partie joué de ${pseudo} a été mis à jour.`);
        } else {
            logger.warn(`Aucun joueur trouvé avec le pseudo ${pseudo}.`);
        }

        connection.release();
    } catch (err) {
        logger.warning('Erreur lors de la mise à jour du score:', err);
    }
}