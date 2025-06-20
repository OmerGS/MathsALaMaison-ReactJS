import { logger } from '../config/logger.js';
import { playersSockets } from '../services/webSocket.js';
import { addPoint, addVictory, addPlayedGame } from './playerController.js';
import { winnerPoint, clickGoal } from '../config/gameAttribute.js';
import { playersSearching } from './matchmakingController.js';

/**
 * An object to store game-related data.
 * This object holds information about games
 * 
 * @type {Object}
 */
export let games = {};

/**
 * Creates a new game with the given players and stores it in the `games` object.
 * It generates a unique game ID, initializes the game with player scores, 
 * and sends a message to inform players about the created game.
 * 
 * @function
 * @param {Array<string>} players - An array of player names or identifiers for the players in the game.
 * @returns {void}
 */
export function createGame(players) {
    const gameId = generateGameId();
    logger.info(`Création de la partie avec l'ID ${gameId} et les joueurs : ${players.join(', ')}`);

    // Création d'une nouvelle partie
    const game = {
        id: gameId,
        players: players,
        scores: {},
        clickGoal: clickGoal,
    };

    // Initialisation des scores des joueurs
    players.forEach(player => {
        game.scores[player] = 0;
    });

    // Sauvegarde la partie dans l'objet games
    games[gameId] = game;

    // Envoi du message de création de partie aux joueurs
    const gameMessage = JSON.stringify({
        type: 'gameCreated',
        gameId: gameId,
        players: players,
        clickGoal: game.clickGoal,
    });

    // Envoi aux joueurs pour les informer de la création de la partie
    players.forEach(player => {
        const playerSocket = playersSockets[player];
        if (playerSocket && playerSocket.readyState === WebSocket.OPEN) {
            playerSocket.send(gameMessage);
        }

        const index = playersSearching.indexOf(player);
        if (index !== -1) {
            playersSearching.splice(index, 1);
        }
    });
}

/**
 * Generates a unique game ID based on the current timestamp.
 * The ID is prefixed with 'game-' followed by the current timestamp to ensure uniqueness.
 * 
 * @function
 * @returns {string} A unique game ID.
 */
export function generateGameId() {
    return 'game-' + Date.now();
}

/**
 * Handles the event when a player clicks, updates the score, checks for a winner,
 * and sends messages to the players. If the game ends, it sends a game over message 
 * and updates the players' stats (e.g., points, victories).
 * 
 * @async
 * @function
 * @param {WebSocket} ws - The WebSocket connection for the current player.
 * @param {string} gameId - The unique ID of the game.
 * @param {string} playerId - The ID of the player who made the click.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 */
export async function clickReceived(ws, gameId, playerId) {
    const game = games[gameId];

    // Vérifie si la partie existe
    if (game) {
        game.scores[playerId] += 1;

        // Vérifie si le joueur a atteint l'objectif de clics
        if (game.scores[playerId] >= game.clickGoal) {
            const gameEndMessage = JSON.stringify({
                type: 'gameOver',
                gameId: gameId,
                winner: playerId,
                message: `${playerId} a gagné la partie !`,
            });

            // Envoi de la fin de la partie aux joueurs
            game.players.forEach(async (player) => {
                const playerSocket = playersSockets[player];
                if (playerSocket && playerSocket.readyState === WebSocket.OPEN) {
                    playerSocket.send(gameEndMessage);

                    if (player === playerId) {
                        await addPoint(player, winnerPoint);
                        await addVictory(player);  
                    } else {
                        await addPlayedGame(player);  
                    }
                }
            });

            await addPlayedGame(playerId); 
            delete games[gameId]; 
            logger.info(`La partie ${gameId} est terminée. ${playerId} a gagné !`);
        } else {
            // Envoie la mise à jour des scores aux joueurs
            const scoreUpdateMessage = JSON.stringify({
                type: 'scoreUpdate',
                gameId: gameId,
                scores: game.scores,
            });

            game.players.forEach((player) => {
                const playerSocket = playersSockets[player];
                if (playerSocket && playerSocket.readyState === WebSocket.OPEN) {
                    playerSocket.send(scoreUpdateMessage);
                }
            });
        }
    } else {
        logger.warn(`La partie ${gameId} n'existe pas.`);
    }
}

/**
 * Handles the event when a player leaves a game. It removes the player from the game, 
 * sends a notification to the remaining players, and deletes the game if there are no players left.
 * 
 * @function
 * @param {WebSocket} ws - The WebSocket connection for the current player.
 * @param {string} gameId - The unique ID of the game the player is leaving.
 * @param {string} playerId - The ID of the player leaving the game.
 * @returns {void}
 */
export function leaveGame(ws, gameId, playerId) {
    logger.info(`Salle de jeu : ${gameId}`);
    logger.info(`Joueur concerné : ${playerId}`);

    const game = games[gameId];

    // Vérifie si la partie existe
    if (game) {
        const playerIndex = game.players.indexOf(playerId);

        // Si le joueur est dans la partie
        if (playerIndex !== -1) {
            game.players.splice(playerIndex, 1);  // Retire le joueur de la partie

            logger.info(`${playerId} a quitté la partie ${gameId}`);

            // Envoie un message aux autres joueurs pour les prévenir
            game.players.forEach(player => {
                sendMessageToPlayer(player, {
                    type: 'player_left',
                    gameId: gameId,
                    playerId: playerId,
                });
            });

            // Si plus aucun joueur dans la partie, on supprime la partie
            if (game.players.length === 0) {
                delete games[gameId];
                logger.info(`La partie ${gameId} est terminée car il n'y a plus de joueurs.`);
            }
        } else {
            logger.warn(`Le joueur ${playerId} n'est pas dans la partie ${gameId}`);
        }
    } else {
        logger.warn(`La partie ${gameId} n'existe pas.`);
    }
}

/**
 * Sends a message to a specific player via their WebSocket connection.
 * If the player's socket is not found, logs a warning.
 * 
 * @function
 * @param {string} playerId - The ID of the player to whom the message will be sent.
 * @param {Object} message - The message to send, which will be stringified before sending.
 * @returns {void}
 */
function sendMessageToPlayer(playerId, message) {
    const playerSocket = playersSockets[playerId];
    if (playerSocket) {
        playerSocket.send(JSON.stringify(message));
    } else {
        logger.warn(`La socket pour le joueur ${playerId} est introuvable.`);
    }
}