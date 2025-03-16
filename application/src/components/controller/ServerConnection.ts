import axios from 'axios';
import BACKEND_API from '../../properties/BACKEND_API';
import API_KEY from '../../properties/API_KEY';
import { Alert } from 'react-native';
import { User } from '../model/User';
import Questions from '../model/Questions';

/**
 * API class for interacting with the application's database.
 *
 * This class handles server connections, fetching and managing users,
 * and data validation. It sends JSON requests to a Node.js server,
 * which verifies API keys before interacting with the database.
 */
class API {
  /**
  * Array containing the users.
  * @type {User[]}
  */
  private static users: User[] = [];

  /**
   * Asynchronous method to fetch all users from the database
   * and store them in the global `users` variable.
   * 
   * @returns {Promise<void>} - A promise that resolves when the users are fetched.
   * @throws {Error} - Throws an error if fetching fails.
   */
  public static async fetchUsers(): Promise<void> {
    try {
      const response = await axios.get(`${BACKEND_API.baseURL}/users`, {
        headers: {
          'x-api-key': `${API_KEY.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      API.users = await Promise.all(
        response.data.map(async (userData: any) => {
          return await User.createFullUser(userData.pseudo, userData.email, userData.password, userData.salt, userData.point, userData.nombrePartie, userData.nombreVictoire, userData.isPremium, userData.photoDeProfil);
        })
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Adds a new user to the local user array.
   *
   * @param {User} user - The user to add.
   */
  public static addUser(user: User){
    this.users.push(user);
  }

  /**
  * Retrieves the list of users.
  *
  * @returns {User[]} - A list of {@link User} object.
  */
  public static getUsers(): User[] {
    return API.users;
  }

  /**
   * Checks if an email is already associated with an account.
   *
   * @param {string} email - The email to check.
   * @returns {boolean} - True if the email exists, otherwise false.
   */
  public static checkEmailExists(email: string): boolean {
    const user = API.users.find((user) => user.getEmail() === email);
    return !!user;
  }

  /**
   * Checks if a username is already associated with an account.
   *
   * @param {string} pseudo - The username to check.
   * @returns {boolean} - True if the username exists, otherwise false.
   */
  public static checkPseudoExists(pseudo: string): boolean {
    const user = API.users.find((user) => user.getPseudo()?.toLowerCase() === pseudo.toLowerCase());
    return !!user;
  }

  /**
   * Searches for a user in the array based on the provided identifier.
   * The identifier can be either an email or a username.
   *
   * @param {string} identifier - The identifier to search for.
   * @returns {User | undefined} - Returns a `User` object if found, otherwise `undefined`.
   */
  public static getUserByIdentifier(identifier: string): User | undefined {
    this.fetchUsers();

    let userByEmail;
    let userByPseudo;

    // Rechercher un utilisateur correspondant à l'email
    for (let i = 0; i < API.users.length; i++) {
      const user = API.users[i];

      if (user.getEmail() === identifier) {
      userByEmail = user;
      break;
      }
    }

    // Si un utilisateur est trouvé par email, le retourner
    if (userByEmail !== undefined) {
      return userByEmail;
    }

    // Rechercher un utilisateur correspondant au pseudo si aucun email trouvé
    for (let i = 0; i < API.users.length; i++) {
      const user = API.users[i];

      if (user.getPseudo() === identifier) {
      userByPseudo = user;
      break;
      }
    }

      return userByPseudo;
  }

  /**
   * Send a ping to server with the identifier of the user.
   * @param identifier 
   */
  public static async checkOnlinePlayer(identifier: string): Promise<void> {
    try {
      await axios.post(`${BACKEND_API.baseURL}/checkOnlinePlayer`, 
        {
        identifier,
        },
        {
          headers: {
            'x-api-key': `${API_KEY.API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
      console.log('Statut en ligne mis à jour avec succès.');
    } catch (error) {
      console.error("Erreur lors de l'envoi du statut d'utilisateur :", error);
    }
  }



  /**
   * Saves a user to the database.
   *
   * @param {User} user - The user to save.
   * @returns {Promise<boolean>} - Resolves to true if saving is successful, otherwise false.
   */
  public static async saveToDatabase(user: User): Promise<boolean> {
    try {
      const response = await axios.post(`${BACKEND_API.baseURL}/register`, 
        {
          pseudo: user.getPseudo(),
          email: user.getEmail(),
          password: user.getPassword(),
          salt: user.getSalt(),
          point: user.getPoint(),
          nbPartie: user.getNbPartie(),
          nbVictoire: user.getNbVictoire(),
          isPremium: user.getPremium(),
          photoDeProfil: user.getPhotoDeProfil(),
        },
        {
          headers: {
            'x-api-key': `${API_KEY.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Erreur', 'Erreur lors de la sauvegarde de l\'utilisateur.');
      return false;
    }
  }

  /**
   * Validates whether an email is in the correct format `test@example.com`
   * and does not exceed 64 characters.
   *
   * @param {string} email - The email to validate.
   * @returns {boolean} - True if the email is valid, otherwise false.
   */
  public static validMail(email: string): boolean {
    if (!email) {
      console.log("Erreur : email null !");
      return false;
    } else if (email.length > 64) {
      console.log("Erreur : email trop long (plus de 64 caractères) !");
      return false;
    } else {
      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (emailPattern.test(email)) {
        return true;
      } else {
        console.log("Erreur : email invalide !");
        return false;
      }
    }
  }

  /**
   * Verifies login credentials by contacting the Node.js server.
   *
   * @param {string} identifier - The user's username or email.
   * @param {string} password - The user's password.
   * @returns {Promise<boolean>} - Resolves to true if login is successful, otherwise false.
   */
  public static loginUser = async (identifier: string, password: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${BACKEND_API.baseURL}/login`, 
            { identifier, password }, 
            {
                headers: {
                    'x-api-key': `${API_KEY.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
  
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
  };
  

  /**
   * Deletes a user account by sending a request to the Node.js server.
   *
   * @param {string} email - The email of the account to delete.
   * @returns {Promise<boolean>} - Resolves to true if the deletion is successful, otherwise false.
   */
  public static async deleteUserAccount(email: string): Promise<boolean> {
    try {
      const response = await axios.post(`${BACKEND_API.baseURL}/delete`, 
        { identifier: email }, 
        {
          headers: {
            'x-api-key': `${API_KEY.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.success;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  /**
   * Updates the user's profile picture.
   *
   * @param {number} idPicture - The profile picture ID.
   * @param {string} email - The user's email.
   * @returns {Promise<boolean>} - True if the update is successful, otherwise false.
   */
  public static async saveProfilPicture(idPicture: number, email: string): Promise<boolean> {
    try {
      const response = await axios.post(`${BACKEND_API.baseURL}/updatePicture`, 
        {
          idPicture,
          email,
        },
        {
          headers: {
            'x-api-key': `${API_KEY.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Erreur', 'Erreur lors du changement de photo de profil');
      return false;
    }
  }

  /**
  * 
  * @param email 
  * @returns 
  */
  public static async askVerificationCode(email: string): Promise<boolean> {
    try {
      const response = await axios.post(`${BACKEND_API.baseURL}/askVerificationCode`, 
        {
          email,
        },
        {
          headers: {
            'x-api-key': `${API_KEY.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Erreur', 'Erreur lors de la demande du code');
      return false;
    }
  }

  /**
   * 
   * @param email 
   * @param code 
   * @returns 
   */
  public static async checkVerificationCode(email: string, code: string): Promise<boolean> {
    try {
      const response = await axios.post(`${BACKEND_API.baseURL}/checkVerificationCode`, 
        {
          email,
          code,
        },
        {
          headers: {
            'x-api-key': `${API_KEY.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  }


  /**
   * Updates the user's password.
   *
   * @param {string} pseudo - The user's username.
   * @param {string} password - The new password.
   * @param {string} salt - The password salt.
   * @returns {Promise<boolean>} - True if the update is successful, otherwise false.
   */
  public static async updatePassword(email: string, password: string, salt: string){
    try {
      const response = await axios.post(`${BACKEND_API.baseURL}/updatePassword`, 
        {
          email,
          password,
          salt
        },
        {
          headers: {
            'x-api-key': `${API_KEY.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.success;
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Erreur', 'Erreur lors du changement de mot de passe');
      return false;
    }
  }

  /**
   * Updates the user's username.
   *
   * @param {string} email - The user's email.
   * @param {string} pseudo - The new username.
   * @returns {Promise<boolean>} - True if the update is successful, otherwise false.
   */
  public static async updatePseudo(email: string, pseudo: string){
    try {
      const response = await axios.post(`${BACKEND_API.baseURL}/updatePseudo`, 
        {
          pseudo,
          email,
        },
        {
          headers: {
            'x-api-key': `${API_KEY.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data.success;
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Erreur', 'Erreur lors du changement de pseudo');
      return false;
    }
  }

  /**
   * Updates the user's email.
   *
   * @param {string} email - The new email.
   * @param {string} pseudo - The user's username.
   * @returns {Promise<boolean>} - True if the update is successful, otherwise false.
   */
  public static async updateEmail(email: string, pseudo: string){
    try {
      const response = await axios.post(`${BACKEND_API.baseURL}/updateEmail`, 
        {
          pseudo,
          email,
        },
        {
          headers: {
            'x-api-key': `${API_KEY.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data.success;
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Erreur', 'Erreur lors du changement de email');
      return false;
    }
  }

  /**
  * Return the number of player for starting a game.  
  * @returns Number of player
  */
  public static async getNumberOfPlayerForOneGame(): Promise<string> {
    try {
      const response = await axios.get(`${BACKEND_API.baseURL}/numberOfPlayer`, {
        headers: {
          'x-api-key': `${API_KEY.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Extrait la valeur de playerPerGame
      return response.data.playerPerGame;
    } catch (error) {
      console.error('Error fetching number of players:', error);
      throw new Error('Failed to fetch number of players');
    }
  }  
  
  
  

  /**
   * Array containing questions.
   * @type {Questions[]}
   */
  private static questions: Questions[] = [];

  /**
   * Asynchronous method to retrieve all questions in the database
   * and store them in the global `questions` variable.
   *
   * @returns {Promise<void>} - A promise that resolves when questions are fetched.
   * @throws {Error} - Throws an error if fetching fails.
   */
  public static async fetchQuestions(): Promise<void> {
    try {
      const response = await axios.get(`${BACKEND_API.baseURL}/questions`, {
        headers: {
          'x-api-key': `${API_KEY.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      API.users = await Promise.all(
        response.data.map(async (questionsData: any) => {
          this.questions.push(new Questions(questionsData.id, questionsData.typeQuestion, questionsData.question, questionsData.reponse, questionsData.image_data, questionsData.correction, questionsData.typeReponse));
          
        })
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * The current page number for question pagination.
   * @type {number}
   */
  private static currentPage = 0;

  /**
   * Loads a specific number of questions based on pagination.
   *
   * @param {number} limit - The number of questions to load per page.
   * @returns {Questions[]} - A list of questions for the current page.
   */
  public static getQuestions(limit: number = 10): Questions[] {
    // Calcule les indices de début et de fin pour la pagination
    const startIndex = (this.currentPage - 1) * limit;
    const endIndex = this.currentPage * limit;
  
    // Sélectionne les questions de la page courante
    const paginatedQuestions = this.questions.slice(startIndex, endIndex);
  
    // Incrémente la page pour la prochaine demande
    this.currentPage += 1;
  
    return paginatedQuestions;
  }

  /**
   * Retrieves a random question from the questions list.
   *
   * @returns {Questions} - A random question.
   * @throws {Error} - Throws an error if no questions are available.
   */
  public static getRandomQuestion(): Questions {
    if (this.questions.length === 0) {
        throw new Error('No questions available. Ensure fetchQuestions is called first.');
    }
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    return this.questions[randomIndex];
  }
  
}

export default API;
export { User };
