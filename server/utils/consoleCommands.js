import readline from 'readline';
import { logger } from '../config/logger.js';
import { games } from '../controller/gameController.js'; 
import { playersSockets } from '../services/webSocket.js';
//import { activeUsers } from '../routes/userRoutes.js';
import os from 'os';
import { personalizedDisplayAsciiArt } from './asciiArt.js';
import sendMail from '../services/mailService.js';
import { ColorEnum, colorize } from './color.js';

/**
 * Creates a readline interface for reading input from the standard input (keyboard) and outputting to the standard output (console).
 * 
 * @type {readline.Interface}
 * @description 
 * The `readline.createInterface` method creates an interface that allows for reading data from the terminal input and writing output to the terminal.
 * It is commonly used for interactive command-line applications where the program waits for user input and responds accordingly.
 * 
 * @property {Readable} input - The stream to read input from. Here, it reads from the standard input (`process.stdin`).
 * @property {Writable} output - The stream to write output to. Here, it writes to the standard output (`process.stdout`).
 */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * Lists all ongoing games with relevant details.
 * 
 * This function checks if there are any ongoing games and logs their details to the console.
 * It provides information such as game ID, players, scores, game status, and click goal for each game.
 * If no games are currently in progress, it logs a message indicating that there are no games.
 * 
 * @function
 * @returns {void}
 * @example
 * listGames(); // Logs details of ongoing games or "No ongoing games" if none exist
 */
function listGames() {
    logger.info("Demande des parties en cours.");

    if (Object.keys(games).length === 0 || Object.keys(games) === undefined) {
        console.log(colorize("Aucune partie en cours.", ColorEnum.RED));
        return;
    }

    console.log(colorize("Parties en cours :", ColorEnum.CYAN));
    Object.values(games).forEach((game) => {
        console.log(colorize('--------------------------', ColorEnum.YELLOW));
        console.log(colorize(`Game ID: ${game.id}`, ColorEnum.MAGENTA));
        console.log(colorize(`Players: ${game.players.join(', ')}`, ColorEnum.GREEN));
        console.log(colorize(`Scores: ${JSON.stringify(game.scores)}`, ColorEnum.WHITE));
        console.log(colorize(`Status: ${game.gameStatus || "In Progress"}`, ColorEnum.BLUE));
        console.log(colorize(`Click goal: ${game.clickGoal}`, ColorEnum.CYAN));
        console.log(colorize('--------------------------', ColorEnum.YELLOW));
    });
}


/**
 * Lists all currently connected players.
 * 
 * This function filters through the players' WebSocket connections and lists those who are currently online
 * and have an active connection (readyState of 1). If no players are connected, it logs a message indicating 
 * that no players are currently connected.
 * 
 * @function
 * @returns {void}
 * @example
 * listConnectedPlayers(); // Logs a list of currently connected players or "No players connected" if none exist
 */
function listConnectedPlayers() {
    logger.info("Demande des joueurs connectés.");
    const connectedPlayers = Object.keys(playersSockets).filter(
        (playerId) => playersSockets[playerId]?.readyState === 1
    );

    if (connectedPlayers.length === 0) {
        console.log("Aucun joueur actuellement connecté.");
        return;
    }

    console.log(`Joueurs connectés (${connectedPlayers.length}) :`);
    connectedPlayers.forEach((player) => {
        console.log(`- ${player}`);
    });
}

/**
 * Logs the current status of the server, including uptime, CPU load, and available memory.
 * 
 * This function logs the following information:
 * - Server uptime in hours and minutes
 * - CPU load average (1-minute load)
 * - Free memory in MB
 * 
 * It uses `process.uptime()`, `os.loadavg()`, and `os.freemem()` to gather the relevant data.
 * 
 * @function
 * @returns {void}
 * @example
 * serverStatus(); // Logs the server's uptime, CPU load, and free memory in MB.
 */
function serverStatus() {
    // Uptime
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    console.log(colorize(`Le serveur tourne depuis ${hours} heures et ${minutes} minutes.`, ColorEnum.CYAN));

    // CPU Load
    const loadAvg = os.loadavg().map(avg => avg.toFixed(2));
    console.log(colorize("État de la charge CPU :", ColorEnum.MAGENTA));
    console.log(colorize(`  Moyenne sur 1 minute  : ${loadAvg[0]} (Charge actuelle)`, ColorEnum.WHITE));
    console.log(colorize(`  Moyenne sur 15 minutes: ${loadAvg[2]} (Tendance à court terme)`, ColorEnum.WHITE));

    if (loadAvg[0] < 1) {
        console.log(colorize("  Le processeur est sous-utilisé.", ColorEnum.GREEN));
    } else if (loadAvg[0] === 1) {
        console.log(colorize("  Le processeur est utilisé à pleine capacité.", ColorEnum.YELLOW));
    } else {
        console.log(colorize("  Le processeur est surchargé, avec plus de travail que ce qu'il peut traiter.", ColorEnum.RED));
    }

    // Memory Usage
    const usedMemory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2);
    console.log(colorize(`Mémoire utilisée : ${usedMemory} Mo / ${totalMemory} Mo`, ColorEnum.CYAN));
}



let isMaintenanceMode = false;
/**
 * Toggles the maintenance mode of the server.
 * 
 * This function switches the `isMaintenanceMode` flag between `true` and `false` and logs
 * the current state of the maintenance mode (activated or deactivated).
 * 
 * @function
 * @returns {void}
 * @example
 * toggleMaintenance(); // Toggles the maintenance mode and logs the new state.
 */
function toggleMaintenance() {
    isMaintenanceMode = !isMaintenanceMode;
    console.log(`Le mode maintenance est maintenant ${isMaintenanceMode ? 'activé' : 'désactivé'}.`);
}

/**
 * Lists the active and inactive players based on their last connection time.
 * 
 * The function checks the `activeUsers` object to determine which players are currently
 * connected (based on the last seen time) and which players are disconnected.
 * Players who have been inactive for more than 1 minute are considered disconnected.
 * 
 * The function logs the lists of connected and disconnected players to the console.
 * 
 * @function
 * @returns {void}
 * @example
 * listActivePlayers(); // Logs the list of active and inactive players.
 */
function listActivePlayers() {
    const now = Date.now();
    const timeout = 1 * 60 * 1000;

    const connectedPlayers = [];
    const disconnectedPlayers = [];

    Object.keys(activeUsers).forEach((user) => {
        const { lastSeen, lastConnectionDate } = activeUsers[user];
        if (now - lastSeen < timeout) {
            connectedPlayers.push(user);
        } else {
            disconnectedPlayers.push({ identifier: user, lastConnectionDate });
        }
    });

    console.log("***** JOUEUR CONNECTE *****");
    if (connectedPlayers.length === 0) {
        console.log("Aucun joueur connecté pour le moment.");
    } else {
        connectedPlayers.forEach((player) => console.log(`- ${player}`));
    }

    console.log("\n***** JOUEUR NON CONNECTE *****");
    if (disconnectedPlayers.length === 0) {
        console.log("Aucun joueur déconnecté.");
    } else {
        disconnectedPlayers.forEach((player) =>
            console.log(`- ${player.identifier} (Dernière Connexion : ${player.lastConnectionDate})`)
        );
    }
}

/**
 * Clears the console output.
 * 
 * This function calls `console.clear()` to clear the console, removing all previous logs.
 * 
 * @function
 * @returns {void}
 * @example
 * clear(); // Clears the console.
 */
function clear(){
    console.clear();
}

/**
 * Displays a list of available commands and their descriptions.
 * 
 * This function logs a list of available commands and their descriptions to the console
 * to assist users in understanding the available actions they can perform in the system.
 * 
 * @function
 * @returns {void}
 * @example
 * displayHelp(); // Displays the list of available commands.
 */
function displayHelp() {
    console.log("Commandes disponibles :");
    console.log("  clear           - Efface le terminal.");
    console.log("  gamelist        - Affiche les parties en cours.");
    console.log("  playermm        - Affiche les joueurs connecté en WebSocket.");
    console.log("  players         - Affiche les joueurs connecté dans le jeu.");
    console.log("  serverstatus    - Affiche l'état actuel du serveur.");
    console.log("  license         - Affiche la license.");
    console.log("  maintenance     - Active ou désactive le mode maintenance.");
    console.log("  help            - Affiche cette liste d'aide.");
}

/**
 * Listens for user input from the command line and executes corresponding commands.
 * 
 * This function listens for the `line` event on the readline interface. When a user enters
 * a command, it parses the input and executes the appropriate function based on the
 * command entered. If the command is unknown, it prompts the user to type 'help' to view
 * the available commands.
 * 
 * @param {string} input - The user input entered in the command line.
 * @returns {void}
 * @example
 * rl.on('line', (input) => { // Executes a command based on the input
 *     // Logic for handling input
 * });
 */
rl.on('line', (input) => {
    const args = input.trim().split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
        case 'clear':
            clear();
            break;
        case 'gamelist':
            listGames();
            break;
        case 'playermm':
            listConnectedPlayers();
            break;
        case 'players':
            listActivePlayers();
            break;
        case 'serverstatus':
            serverStatus();
            break;
        case 'maintenance':
            toggleMaintenance();
            break;
        case 'help':
            displayHelp();
            break;
        case 'mail':
            if (args.length < 3) {
                console.log('Erreur : La commande mail nécessite un destinataire, un sujet et un message.');
                return;
            }

            const to = args[1];
            const subject = args[2];
            const message = args.slice(3).join(' ');

            sendMail(to, subject, message);
            break;
        default:
            console.log("Commande inconnue. Tapez 'help' pour voir la liste des commandes.");
    }
});
