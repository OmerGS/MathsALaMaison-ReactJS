import { Alert } from 'react-native';
import API from './ServerConnection';
import { PasswordUtil } from '../util/password-util';

/**
 * Handles the password reset process by requesting a verification code to be sent to the provided email.
 * 
 * This function calls the API to request a verification code, notifies the user of the result via an alert,
 * and provides haptic feedback based on the outcome. It returns an object indicating the success or failure of 
 * the operation.
 * 
 * @param {any} navigation - The navigation object used for navigating between screens, if necessary.
 * @param {string} email - The email address to which the verification code will be sent.
 * 
 * @returns {Promise<{ success: boolean }>} - A promise that resolves to an object indicating the success or 
 * failure of the password reset request.
 *   - success: true if the code was successfully sent, false if there was an error.
 */
export const handleResetPassword = async (
  navigation: any,
  email: string,
) => {
  /*console.log("---------- Reçu de formulaire ----------");
  console.log("Adresse mail :", email);*/

  // Appeler l'API pour demander un code de vérification
  const response = await API.askVerificationCode(email);
  
  if (response) {
    Alert.alert("Un code vous a été envoyé à " + email);
    return { success: true };
  } else {
    Alert.alert("Une erreur est survenue, réessayez plus tard");
    return { success: false };
  }
};

/**
 * Validates the verification code entered by the user.
 * 
 * This function checks the provided verification code against the one sent to the provided email.
 * If the code is valid, it updates the state to indicate that the code has been validated and prompts the user
 * to enter a new password. If the code is invalid, it alerts the user of the error.
 * 
 * @param {any} navigation - The navigation object used for navigating between screens, if necessary.
 * @param {string} email - The email address associated with the verification code.
 * @param {string} code - The verification code entered by the user.
 * @param {Function} setIsCodeValidated - A function to update the state, indicating whether the code is valid.
 * 
 * @returns {Promise<void>} - A promise that resolves when the code validation is complete. No value is returned.
 */
export const handleValidateCode = async (navigation: any, email: string, code: string, setIsCodeValidated: Function) => {
  /*console.log("Validation");
  console.log("Validation du code :", code);
  console.log("Email :", email);*/

  const validCode = await API.checkVerificationCode(email, code);

  if(validCode){
    setIsCodeValidated(true);  // Le code est valide, passer à la saisie du mot de passe
    Alert.alert("Code validé, vous pouvez maintenant entrer un nouveau mot de passe");
  } else {
    Alert.alert("Le code n'est pas valide");
  }
};

/**
 * Changes the user's password by hashing the new password and updating it in the system.
 * 
 * This function hashes the new password using a salt, then sends the updated password and salt to the API to update 
 * the user's password. If successful, it updates the user's password and salt in the local user object, 
 * displays a success message, and navigates to the home screen. If the update fails, it displays an error message.
 * 
 * @param {any} navigation - The navigation object used for navigating between screens.
 * @param {string} identifier - The unique identifier (e.g., email) for the user whose password is being updated.
 * @param {string} newPassword - The new password entered by the user.
 * 
 * @returns {Promise<void>} - A promise that resolves when the password update operation is complete. 
 * No value is returned.
 */
export const handleChangePassword = async (navigation: any, identifier: string, newPassword: string) => {
  /*console.log("Set new password");
  console.log("Email" + identifier);
  console.log("Password :", newPassword);*/

  const salt = await PasswordUtil.getSalt();
  const hashedPassword = PasswordUtil.hashPassword(newPassword, salt);

  if (newPassword.length < 10) {
    Alert.alert('Erreur', "Le mot de passe doit faire au moins 10 caractères.");
    return;
  }

  const passwordUpdated = await API.updatePassword(identifier, hashedPassword, salt);

  if(passwordUpdated){
    let user = API.getUserByIdentifier(identifier);
    user?.setPassword(hashedPassword);
    user?.setSalt(salt);

    Alert.alert("Succès", "Le mot de passe à été changé avec succès");
    navigation.navigate('HomeScreen');
  } else {
      Alert.alert("Erreur", "Le mot de passe n'a pas été changé");
  }
};
