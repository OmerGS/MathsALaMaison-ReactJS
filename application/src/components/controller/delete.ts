import bddAPI from './ServerConnection';
import { Alert } from 'react-native'; 
import { disconnectUser } from './disconnect';
import { NavigationProp } from '@react-navigation/native'; 

/**
* Handles the process of deleting a user account. Displays a confirmation alert 
* before proceeding, deletes the account via the backend, logs the user out, 
* and navigates back to the home screen upon success.
* 
* @async
* @function handleDeleteAccount
* 
* @param {NavigationProp<any>} navigation - The navigation prop used to navigate between screens.
* @param {object} currentUser - The currently logged-in user object, containing the email.
* @param {Function} setCurrentUser - Function to reset the current user (sets it to null after deletion).
* 
* @returns {Promise<void>} - Does not return anything but displays alerts based on the success or failure of the operation.
* 
* @throws Displays an alert in case of an error during the API call or account deletion process.
*/
export const handleDeleteAccount = async (
    navigation: NavigationProp<any>,
    currentUser: { email: string; },
    setCurrentUser: (arg0: null) => void
) => {
  if (!currentUser) Alert.alert("Erreur", "Redémarrer l'application"); 

  Alert.alert(
    "Supprimer le compte",
    "Êtes-vous sûr de vouloir supprimer votre compte ? Cela ne peut pas être annulé.",
    [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        onPress: async () => {
          try {
            const success = await bddAPI.deleteUserAccount(currentUser.email);

            if (success) {
              await disconnectUser(); 
              setCurrentUser(null); 
              navigation.navigate('HomeScreen'); 
              Alert.alert('Succès', 'Compte supprimé avec succès'); 
              await bddAPI.fetchUsers();
            } else {
              Alert.alert('Erreur', 'Impossible de supprimer le compte.'); 
            }
          } catch (error) {
            console.error('Error deleting account:', error); 
            Alert.alert('Erreur', 'Erreur lors de la suppression du compte.'); 
          }
        },
      },
    ]
  );
};
