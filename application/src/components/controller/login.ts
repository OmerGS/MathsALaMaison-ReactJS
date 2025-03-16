import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import bddAPI from './ServerConnection';

/**
* Manages the user login process for the application.
* 
* This function checks if the provided identifier (email or username) exists in the database, 
* and then attempts to log the user in with the given password. 
* If the login is successful, the user's information is stored in AsyncStorage, 
* and the user is redirected to the main screen.
*
* @async
* @function handleLogin
* 
* @param {NavigationProp<any>} navigation - The navigation object used to redirect the user.
* @param {string} identifier - The user's identifier, which can be either an email or a username.
* @param {string} password - The user's password.
* 
* @returns {Promise<boolean>} - Resolves to `true` if the login is successful, otherwise `false`.
* 
* @example
* const isLoggedIn = await handleLogin(navigation, 'test@example.com', 'password123');
* console.log(isLoggedIn); // Logs true if login is successful, otherwise false.
*/
export const handleLogin = async (
  navigation: NavigationProp<any>,
  identifier: string,
  password: string,
) => {
  console.log("---------- Reçu de formulaire ----------");
  console.log("Identifiant :", identifier);
  console.log("Password :", password);

  await bddAPI.fetchUsers();

  const emailExists = bddAPI.checkEmailExists(identifier);
  const pseudoExists = bddAPI.checkPseudoExists(identifier);

  if (!emailExists && !pseudoExists) {
    Alert.alert('Erreur', 'L\'email ou le pseudo n\'existe pas.');
    return false;
  }

  const loginSuccess = await bddAPI.loginUser(identifier, password);

  if (loginSuccess) {

    const user = bddAPI.getUserByIdentifier(identifier);

    if (!user) {
      Alert.alert('Erreur', 'Impossible de récupérer les informations de l\'utilisateur.');
      return false;
    }

    const email = user.getEmail();
    const pseudo = user.getPseudo();
    const point = user.getPoint();
    const nbVictoire = user.getNbVictoire();
    const nbPartie = user.getNbPartie();
    const photoDeProfil = user.getPhotoDeProfil();

    await AsyncStorage.setItem('userSession', JSON.stringify({ pseudo, email, point, nbPartie, nbVictoire, photoDeProfil }));

    Alert.alert("Succès", "Connecté !");
    navigation.navigate('HomeScreen');
    return true;
  } else {
    Alert.alert('Échec', 'Identifiant ou mot de passe incorrect.');
    return false;
  }
};