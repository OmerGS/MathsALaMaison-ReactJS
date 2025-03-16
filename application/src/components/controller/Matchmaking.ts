import WEBSOCKET_API from '../../properties/WEBSOCKET_API';
import { NavigationProp } from "@react-navigation/native";
import { Alert } from "react-native";

/**
* Matchmaking management class using WebSocket.
* Handles party search, game creation, score updates, and other real-time interactions.
*/
class MatchmakingManager {
  /**
  * Represents the WebSocket connection to a game server.
  * This variable is used for real-time communication with the server.
  * @type {WebSocket | null}
  */
  private static socket: WebSocket | null = null;

  /**
  * List of player nicknames searching for a game.
  * This list is updated whenever a player starts searching for a game.
  * @type {string[]}
  */
  private static playersSearching: string[] = [];

  
  /**
  * Navigation used to switch between different pages of the app.
  * Used to navigate to the game screen, for example.
  * @type {NavigationProp<any> | null}
  */
  private static navigation: NavigationProp<any> | null = null;

  /**
  * Nickname of the currently connected player.
  * Used to identify the player in the game.
  * @type {string}
  */
  private static pseudo: string = '';
  
  /**
  * Information about the current game.
  * Contains the game ID, participating players, and the click goal.
  * @type {{ gameId: string; players: string[]; clickGoal: number }}
  */
  private static gameInfo: { gameId: string; players: string[]; clickGoal: number } = {
    gameId: '',
    players: [],
    clickGoal: 0,
  };

  /**
  * Callback triggered when a score update is received.
  * Used to update the UI with the current scores.
  * @type {((scores: { [playerId: string]: number }) => void) | null}
  */
  private static onScoreUpdate: ((scores: { [playerId: string]: number }) => void) | null = null;
  
  /**
  * Stores the scores of players in the current game.
  * The key is the player ID, and the value is their current score.
  * @type {{ [playerId: string]: number }}
  */
  private static scores: { [playerId: string]: number } = {};

  /**
  * Callback triggered when the list of players searching for a game is updated.
  * Allows updating the UI with the players currently searching.
  * @type {((players: string[]) => void) | null}
  */
  private static onPlayersSearchingUpdate: ((players: string[]) => void) | null = null;
  
  /**
  * Callback triggered when a new game is created.
  * Receives the game ID, participating players, and click goal.
  * @type {((gameId: string, players: string[], clickGoal: number) => void) | null}
  */
  private static onGameCreated: ((gameId: string, players: string[], clickGoal: number) => void) | null = null;
  











  /* *** -------- METHODE -------- *** */


  /**
  * Initializes the WebSocket connection.
  * 
  * @param {string} pseudo The player's nickname
  * @param {NavigationProp<any>} navigation Navigation for managing redirections
  * @returns {Promise<void>} Resolves when the connection is established, rejects if it fails
  */
  public static async initializeWebSocket(pseudo: string, navigation: NavigationProp<any>) {
    if (this.socket) return;

    this.pseudo = pseudo;
    this.navigation = navigation;
    this.socket = new WebSocket(`${WEBSOCKET_API.baseURL}`);

    return new Promise<void>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("WebSocket initialization failed"));
        return;
      }

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        resolve();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error', error);
        reject(new Error('WebSocket failed to connect'));
      };

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'updatePlayers':
            this.playersSearching = message.players;
            if (this.onPlayersSearchingUpdate) {
              this.onPlayersSearchingUpdate(this.playersSearching);
            }
            break;
          case 'gameCreated':
            this.handleGameCreated(message.gameId, message.players, message.clickGoal);
            break;
          case 'scoreUpdate':
            this.handleScoreUpdate(message.scores);
            break;
          case 'gameOver':
            this.handleGameOver(message.gameId, message.winner);
            break;
          default:
            console.log("Unrecognized message type:", message.type);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.socket = null;
      };
    });
  }





  /* *** Methode for game handling *** */

  /**
  * Handles game creation by redirecting the user to the game screen.
  * 
  * @param {string} gameId The game ID
  * @param {string[]} players The list of players
  * @param {number} clickGoal The click goal
  */
  private static handleGameCreated(gameId: string, playersInGame: string[], clickGoal: number) {
    console.log("Numero de salle : " + gameId);

    this.gameInfo = { gameId, players: playersInGame, clickGoal };

    if (playersInGame.includes(this.pseudo) && this.navigation) {
      this.navigation.navigate('ClickerGameScreen', { gameInfo: this.gameInfo }); 
    }

    // Trigger the subscribed callback if available
    if (this.onGameCreated) {
      this.onGameCreated(gameId, playersInGame, clickGoal);
    }
  }

  /**
   * Returns the current game information.
   * 
   * @returns {object} Game information including gameId, players, and clickGoal
   */
  public static getGameInfo(): { gameId: string; players: string[]; clickGoal: number } {
    return this.gameInfo;
  }

  /**
  * Subscribes to game creation updates.
  * 
  * @param {function} callback Function to call when a new game is created
  */
  public static subscribeToGameCreated(callback: (gameId: string, players: string[], clickGoal: number) => void) {
    this.onGameCreated = callback;
  }

  /**
  * Send a package to game server when player leave a game.
  * @param gameId The game room
  */
  public static leaveGame(gameId: string) {
    if (this.socket) {
        const message = {
            type: 'leave_game',
            gameId: gameId,
            playerId: this.pseudo,
        };
        this.socket.send(JSON.stringify(message));
        console.log(`${this.pseudo} a quitté la partie ${gameId}`);
    }
  }

  /**
  * Send a package at each click of a player
  * @param gameId The game room
  */
  public static sendClick(gameId: string){
    if (this.socket) {
      const message = {
        type: 'userClick',
        gameId: gameId,
        playerId: this.pseudo,
      };
      this.socket.send(JSON.stringify(message));
      console.log(`${this.pseudo} à cliquer dans la partie ${gameId}`);
    }
  }

  /**
  * Handle when game is over.
  * @param gameId The game room
  * @param winner the winner
  */
  public static handleGameOver(gameId: string, winner: string) {;
    Alert.alert("Succès", `${winner} a gagné`, [
      {
        text: "OK",
        onPress: () => {
          if (this.navigation) {
            this.navigation.navigate('HomeScreen');
          }
        }
      }
    ]);

    this.gameInfo = { gameId: '', players: [], clickGoal: 0 };
  }
  


 /**
 * Handle a score change
 * @param scores The players scores
 */
  private static handleScoreUpdate(scores: { [playerId: string]: number }) {
    this.scores = scores;

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.scores);
    }
  }

  /**
  * Allow to subscribe to score update
  * 
  * @param {function} callback At each update the function will be called
  * 
  */
  public static subscribeToScoreUpdates(callback: (scores: { [playerId: string]: number }) => void) {
    this.onScoreUpdate = callback;
  }

  /**
   * Retrieve the current scores
   * 
   * @returns {[playerId: string]: number} A dictionnary with playerId: scores
   */
  public static getScores(): { [playerId: string]: number } {
    return this.scores;
  }










  /* *** Method to Handle the MatchMaking *** */

  /**
  * Start searching for players
  * 
  * @param {string} pseudo The user who want to search a game.
  */
  public static startSearching(pseudo: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'startSearching', pseudo }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  /**
  * Stop searching for player
  * 
  * @param {string} pseudo The user who want to exit the matchmaking
  */  
  public static stopSearching(pseudo: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'stopSearching', pseudo }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  /**
  * Allows a component or service to subscribe to updates on the list of players searching for a game.
  * 
  * @param {function} callback The function that will be called each time the list of players is updated.
  */  
  public static subscribeToPlayersSearchingUpdates(callback: (players: string[]) => void) {
    this.onPlayersSearchingUpdate = callback;
    if (this.navigation) {
      this.initializeWebSocket(this.pseudo, this.navigation);
    }
  }

  /**
  * Retrieve a list which contains the players in matchmaking
  * 
  * @returns {string[]} List of players in MatchMaking 
  */
  public static getPlayersSearching(): string[] {
    return this.playersSearching;
  }
}

export default MatchmakingManager;