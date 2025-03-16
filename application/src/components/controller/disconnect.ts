import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

/**
* Logs the user out of the application.
* 
* This method removes the user's session stored in AsyncStorage. 
* If a session is found and successfully deleted, an alert is displayed 
* to inform the user of their logout. If no session is found or an error occurs, 
* appropriate messages are logged to the console.
*
* @async
* @function disconnectUser
* 
* @returns {Promise<boolean>} - Resolves to `true` if the logout was successful, 
* or `false` in case of an error.
* 
* @example
* const isDisconnected = await disconnectUser();
* console.log(isDisconnected); // Logs true if successfully logged out.
*/
export const disconnectUser = async () => {
  try {
    const userSession = await AsyncStorage.getItem('userSession');
    
    if (userSession) {
      await AsyncStorage.removeItem('userSession');
      Alert.alert('Déconnecté', "Vous êtes déconnecté avec succès");
    } else {
      console.log("Aucune session utilisateur trouvée");
    }
  } catch (error) {
    console.error('Error loading user session:', error);
  }

  return true;
};