import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import bddAPI from './ServerConnection';
import { PasswordUtil } from '../util/password-util';

/**
* Manages the process of changing a user's password by validating inputs,
* verifying the authenticity of the current password, and updating it if
* all conditions are met. Redirects to the home screen upon success.
*
* @async
* @function handleChangePassword
* 
* @param {NavigationProp<any>} navigation - The navigation prop for navigating between screens.
* @param {string} pseudo - The username of the user.
* @param {string} currentPassword - The user's current password.
* @param {string} newPassword - The new password desired by the user.
* @param {string} confirmPassword - The confirmation of the new password.
* 
* @returns {Promise<void>} - Does not return anything but displays alerts based on the success or failure of the operation.
* 
* @throws Displays an alert in case of an error during the API call or verification.
*/
export const handleChangePassword = async (
    navigation: NavigationProp<any>,
    email: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
) => {
    /*
    console.log("------------------ FORMULAIRE ------------------")
    console.log("Pseudo : " + pseudo);
    console.log("currentPassword : " + currentPassword);
    console.log("newPassword : " + newPassword);
    console.log("confirmPassword : " + confirmPassword);
    console.log("------------------ FIN FORMULAIRE ------------------")
    */

    // Ensure all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert("Erreur", "Tous les champs doivent être remplis.");
        return;
    }

    // Check if the new password matches the confirmation
    if (newPassword !== confirmPassword) {
        Alert.alert('Erreur', "Les mots de passe ne correspondent pas.");
        return;
      } else if (newPassword.length < 10) {
        Alert.alert('Erreur', "Le mot de passe doit faire au moins 10 caractères.");
        return;
      }
    
    // Verify that the current password is correct
    const currentPasswordState = await bddAPI.loginUser(email, currentPassword);

    // Retrieve the user via the backend API
    const currentUser = bddAPI.getUserByIdentifier(email);

    if(!currentPasswordState){
        Alert.alert("Erreur", "Le mot passe actuelle est incorrect")
        return;
    } else if(currentUser) {
        // If the current password is correct, hash the new password and store it in the database
        const sel = await PasswordUtil.getSalt();
        const hashedPassword = currentUser.setNewPassword(newPassword, sel);

        const passwordUpdated = await bddAPI.updatePassword(email, hashedPassword, sel);
    
        if(passwordUpdated){
            Alert.alert("Succès", "Le mot de passe à été changé avec succès");
            navigation.navigate('HomeScreen');
        } else {
            Alert.alert("Erreur", "Le mot de passe n'a pas été changé");
        }
    }
};