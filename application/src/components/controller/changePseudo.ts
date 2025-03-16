import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import bddAPI from './ServerConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/components/model/User';

/**
* Manages the process of changing a user's username by validating inputs,
* checking username availability, updating it in the backend, and saving it
* in AsyncStorage. Upon success, redirects the user to the home screen.
*
* @async
* @function handleChangePseudo
* 
* @param {NavigationProp<any>} navigation - The navigation prop used to navigate between screens.
* @param {string} email - The email of the user requesting the username change.
* @param {string} pseudo - The new username desired by the user.
* @param {object} currentUser - The current user's object containing ongoing session information.
* 
* @returns {Promise<void>} - Does not return anything but displays alerts based on the success or failure of the operation.
* 
* @throws Displays an alert in case of an error during the API call.
*/
export const handleChangePseudo = async (
    navigation: NavigationProp<any>,
    email: string,
    pseudo: string,
    currentUser: any
) => {
    if (!email || !pseudo) {
        Alert.alert("Erreur", "Les deux champs doivent être remplis !");
        return;
    }

    try {
        // Validation via la classe User
        var tempUser = bddAPI.getUserByIdentifier(email);
        
        if (tempUser === undefined) {
            Alert.alert("Erreur", "L'email n'est pas associé à un compte !");
            return;
        }

        const pseudoExist = bddAPI.checkPseudoExists(pseudo);
        if (pseudoExist) {
            Alert.alert("Erreur", "Ce pseudo est déjà utilisé !");
            return;
        }

        tempUser.setPseudo(pseudo);

        // Met à jour le pseudo via l'API
        const updatedPseudo = await bddAPI.updatePseudo(email, pseudo);
        if (updatedPseudo) {
            Alert.alert("Succès", "Votre pseudo a été mis à jour avec succès !");

            // Met à jour le pseudo dans la session
            await AsyncStorage.setItem(
                'userSession',
                JSON.stringify({ ...currentUser, pseudo })
            );

            // Redirection vers l'écran principal
            navigation.navigate("HomeScreen");
        } else {
            Alert.alert(
                "Erreur",
                "Une erreur est survenue lors du changement de pseudo"
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert('Erreur', error.message);
        } else {
            Alert.alert('Erreur', 'Une erreur inconnue est survenue.');
        }
    }
};

