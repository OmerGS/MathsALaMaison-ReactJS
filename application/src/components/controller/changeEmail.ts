import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import bddAPI from './ServerConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics'; 

/**
* Handles updating a user's email after verifying their password.
* This function checks if the password is correct and if the email is available,
* then updates the user's email in the database. Upon success, it saves the 
* update in the session and redirects the user to the home page.
*
* @param {NavigationProp<any>} navigation - Navigation object to redirect the user.
* @param {string} email - New email address entered by the user.
* @param {string} pseudo - Current username of the user.
* @param {string} password - Current password of the user.
* @param {any} currentUser - Data of the currently logged-in user, used to update the session.
*
* @returns {Promise<void>} - A promise that resolves when the email change process is complete.
*
* @example
* handleChangeEmail(navigation, 'new-email@example.com', 'username', 'password123', currentUser);
*/
export const handleChangeEmail = async (
    navigation: NavigationProp<any>,
    email: string,
    pseudo: string,
    password: string,
    currentUser: any
) => {
    /*
    console.log("------------------ FORMULAIRE ------------------");
    console.log("Pseudo:", pseudo);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("------------------ FIN FORMULAIRE ------------------");
    */

    const correctPassword = await bddAPI.loginUser(pseudo, password);
    await bddAPI.fetchUsers();

    if(!correctPassword){
        Alert.alert("Erreur", "Le mot de passe n'est pas correct");
        return;
    }

    try {
        // Check if the e-mail is available in the database.
        const emailExist = await bddAPI.checkEmailExists(email);
        if (emailExist) {
            Alert.alert("Erreur", "Cet email est déjà utilisé !");
            return;
        } else if (!bddAPI.validMail(email)) {
            Alert.alert('Erreur', "Cet email n'est pas valide.");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
          }

        // Calling the function, to handle the mail update.
        const updatedEmail = await bddAPI.updateEmail(email, pseudo);
        if (updatedEmail) {
            Alert.alert("Succès", "Votre email a été mis à jour avec succès !");
            
            // Loading the email in the session variable
            await AsyncStorage.setItem(
                'userSession',
                JSON.stringify({ ...currentUser, email })
            );

            // Redirect to HomeScreen
            navigation.navigate("HomeScreen");
        } else {
            Alert.alert("Erreur", "Une erreur est survenue lors du changement de l'email");
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'email:", error);
        Alert.alert("Erreur", "Une erreur est survenue, veuillez réessayer plus tard.");
    }
};