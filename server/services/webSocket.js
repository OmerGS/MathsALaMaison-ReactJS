import { WebSocketServer } from 'ws';
import { logger } from '../config/logger.js';
import { startSearching, stopSearching } from '../controller/matchmakingController.js';
import { leaveGame, clickReceived } from '../controller/gameController.js';

/**
 * Stores the WebSocket connections of players.
 * 
 * @type {Object.<string, WebSocket>}
 * @description 
 * The `playersSockets` object maps each player (identified by their username) to their respective WebSocket connection. 
 * It is used to send messages directly to a specific player using their WebSocket.
 */
export let playersSockets = {}; 

/**
 * List of all clients connected to the WebSocket server.
 * 
 * @type {WebSocket[]}
 * @description 
 * The `clients` array holds all WebSocket objects for the clients currently connected to the server.
 * It is used to manage and track active WebSocket connections.
 */
const clients = []; 

/**
 * Starts the WebSocket server.
 * 
 * @param {http.Server} server - The HTTP server to attach the WebSocket server to.
 * @description 
 * This function initializes the WebSocket server, handling client connections and messages.
 * - When a message is received, it processes different types of messages such as "startSearching", "stopSearching", "leave_game", and "userClick".
 * - It also manages the disconnection of clients and stops matchmaking if necessary.
 */
export function startWebSocketServer(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        // Ajouter le WebSocket du client à la liste des clients connectés
        clients.push(ws);

        // Lorsqu'un message est reçu depuis un client
        ws.on('message', (message) => {
            const parsedMessage = JSON.parse(message.toString());

            // Logique en fonction du type de message
            switch (parsedMessage.type) {
                case 'startSearching':
                    // Démarrer la recherche de matchmaking
                    startSearching(ws, parsedMessage.pseudo);
                    break;
                case 'stopSearching':
                    // Arrêter la recherche de matchmaking
                    stopSearching(ws, parsedMessage.pseudo);
                    break;
                case 'leave_game':
                    // Gérer la sortie d'un jeu
                    leaveGame(ws, parsedMessage.gameId, parsedMessage.playerId);
                    break;
                case 'userClick':
                    // Gérer l'action d'un joueur (clic)
                    clickReceived(ws, parsedMessage.gameId, parsedMessage.playerId);
                    break;
                default:
                    // Log pour message non reconnu
                    logger.info('Type de message non reconnu:', parsedMessage.type);
            }
        });

        // Lorsqu'une connexion est fermée
        ws.on('close', () => {
            // Supprimer le client de la liste des clients
            const index = clients.indexOf(ws);
            if (index !== -1) {
                clients.splice(index, 1);
            }

            // Si le WebSocket a un pseudo, on arrête la recherche de matchmaking
            if (ws.pseudo) {
                stopSearching(ws, ws.pseudo); 
            }
        });
    });

    logger.info('WebSocket server started');
}
