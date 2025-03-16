import { Alert } from 'react-native';
import { User } from '../model/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import bddAPI from './ServerConnection';


/**
* Manages the sign-up process for a new user.
* 
* This function verifies the validity of the email, username, and password provided by the user. 
* If all criteria are met, it creates a new user, saves it in the database, and stores a user session in AsyncStorage. 
* In case of an error, alerts are shown to inform the user of the encountered issue.
*
* @param {NavigationProp<any>} navigation - The navigation object used to navigate through the application.
* @param {string} email - The email address of the user to register.
* @param {string} pseudo - The username of the user to register.
* @param {string} password - The password chosen by the user.
* @param {string} confirmPassword - The confirmation password for validation.
* 
* @returns {Promise<void>} - A promise that resolves to nothing. Alerts are shown in case of errors or successful registration.
*/
export const handleSignUp = async (
  navigation: NavigationProp<any>,
  email: string,
  pseudo: string,
  password: string,
  confirmPassword: string
) => {
  email = email.toLowerCase();

  // Vérifications spécifiques (base de données, e-mail en double)
  await bddAPI.fetchUsers();
  if (bddAPI.checkEmailExists(email)) {
    Alert.alert('Erreur', 'Cet email est déjà utilisé.');
    return;
  }
  if (bddAPI.checkPseudoExists(pseudo)) {
    Alert.alert('Erreur', 'Ce pseudo est déjà pris.');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
    return;
  }

  try {
    // Création du user et validation centralisée dans la classe User
    const newUser = await User.createUser(pseudo, email, password);

    await bddAPI.saveToDatabase(newUser);

    const point = 0;
    const nbVictoire = 0;
    const nbPartie = 0;
    const photoDeProfil = 1;
   
    await AsyncStorage.setItem('userSession', JSON.stringify({ pseudo, email, point, nbPartie, nbVictoire, photoDeProfil}));

    Alert.alert('Réussi', 'Inscription réussie');
    navigation.navigate('HomeScreen');
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert('Erreur', error.message);
    } else {
      Alert.alert('Erreur', 'Une erreur inconnue est survenue.');
    }
  }
};
