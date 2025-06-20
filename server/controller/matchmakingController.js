import { logger } from '../config/logger.js';
import { createGame } from './gameController.js';
import { playersSockets } from '../services/webSocket.js';
import { playerPerGame } from '../config/gameAttribute.js';

/**
 * An array that stores the IDs of players who are currently searching for a game.
 * Players are added to this list when they are looking for a game to join.
 * 
 * @type {Array<string>}
 */
export let playersSearching = [];

/**
 * Adds a player to the waiting list for game matchmaking. If the player is not already in the list,
 * their pseudo is assigned to the WebSocket connection, and they are added to the `playersSearching` array.
 * It also triggers game creation checks and broadcasts the updated list of players searching.
 * 
 * @function
 * @param {WebSocket} ws - The WebSocket connection for the current player.
 * @param {string} pseudo - The pseudo of the player searching for a game.
 * @returns {void}
 */
export function startSearching(ws, pseudo) {
    if (!ws.pseudo) {
        ws.pseudo = pseudo;
        playersSockets[pseudo] = ws; 
    }

    if (playersSearching.includes(pseudo)) {
        logger.warn(`${pseudo} est déjà dans la liste d'attente.`);
        return;
    }

    playersSearching.push(pseudo);
    logger.info(`${pseudo} ajouté à la liste d'attente.`);
    checkForGameCreation();
    broadcastPlayersSearching();
}

/**
 * Removes a player from the waiting list for game matchmaking and broadcasts the updated list.
 * This function is called when a player stops searching for a game.
 * 
 * @function
 * @param {WebSocket} ws - The WebSocket connection for the current player.
 * @param {string} pseudo - The pseudo of the player who is stopping the search for a game.
 * @returns {void}
 */
export function stopSearching(ws, pseudo) {
    playersSearching = playersSearching.filter(player => player !== pseudo);
    broadcastPlayersSearching();
    logger.info(`${pseudo} a arrêté de chercher une partie.`);
}

/**
 * Checks if there are enough players in the waiting list to create a game.
 * If the number of players meets the requirement, it creates a game with the first set of players.
 * 
 * @function
 * @returns {void}
 */
function checkForGameCreation() {
    if (playersSearching.length >= playerPerGame) {
        const playersForGame = playersSearching.slice(0, playerPerGame); 
        createGame(playersForGame);
    }
}

/**
 * Broadcasts the updated list of players who are currently searching for a game to all connected clients.
 * It sends a message with the list of players to every WebSocket connection that is open.
 * 
 * @function
 * @returns {void}
 */
function broadcastPlayersSearching() {
    const message = JSON.stringify({
        type: 'updatePlayers',
        players: playersSearching,
    });

    Object.values(playersSockets).forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
