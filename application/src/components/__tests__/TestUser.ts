import { User } from '../model/User';
import { PasswordUtil } from '../util/password-util';

/**
 * Run tests for the User class.
 */
export async function runUserTests() {
  console.log('===== Début des tests =====');

  await testCreateUser();
  await testCreateFullUser();
  await testValidationPseudo();
  await testValidationEmail();
  await testSetPoint();
  await testSetPassword();
  await testSetNbVictoire();
  await testSetNbPartie();
  await testSetPremium();
  await testSetPhotoProfil();

  console.log('===== Fin des tests =====');
}

// Test de la méthode `createUser`
async function testCreateUser() {
  try {
    const user = await User.createUser('testUser', 'test@example.com', 'securePassword123');
    console.log('✅ Test createUser passé :', user);
  } catch (error) {
    console.error('❌ Test createUser échoué :', error);
  }
}

// Test de la méthode `createFullUser`
async function testCreateFullUser() {
  try {
    const salt = await PasswordUtil.getSalt();
    const user = await User.createFullUser(
      'fullUser',
      'fulluser@example.com',
      'fullPassword123',
      salt,
      100,
      10,
      5,
      true,
      2
    );
    console.log('✅ Test createFullUser passé :', user);
  } catch (error) {
    console.error('❌ Test createFullUser échoué :', error);
  }
}

// Test de la validation du pseudo
async function testValidationPseudo() {
  try {
    await User.createFullUser('Olimer 2', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    console.error('❌ Test validationPseudo échoué : pseudo invalide accepté.');
  } catch (error) {
    console.log('✅ Test validationPseudo passé : pseudo invalide détecté.');
  }

  try {
    await User.createFullUser('Olimer2', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    console.log('✅ Test validationPseudo passé : pseudo valide accepté.');
  } catch (error) {
    console.error('❌ Test validationPseudo échoué : pseudo valide non accepté.');
  }
}

// Test de la validation de l'email
async function testValidationEmail() {
  try {
    const invalidEmail = 'invalid-email';
    await User.createFullUser('validPseudo', invalidEmail, 'validPassword123', 'salt', 0, 0, 0, false, 1);
    console.error('❌ Test validationEmail échoué : email invalide accepté.');
  } catch (error) {
    console.log('✅ Test validationEmail passé : email invalide détecté.');
  }

  try {
    const validMail = 'test@example.com';
    await User.createFullUser('validPseudo', validMail, 'validPassword123', 'salt', 0, 0, 0, false, 1);
    console.log('✅ Test validationEmail passé : email valide accepté.');
  } catch (error) {
    console.error('❌ Test validationEmail échoué : email valide non accepté.');
  }

  try {
    const invalidEmail = 'abcdefghijklmnopqrstuvwxyabcdefhjiklmnopqrstuvwabcdefghijklmnopqrstuvwxyabcdefhjiklmnopqrstuvw@gmail.com';
    await User.createFullUser('validPseudo', invalidEmail, 'validPassword123', 'salt', 0, 0, 0, false, 1);
    console.error('❌ Test validationEmail échoué : email invalide accepté.');
  } catch (error) {
    console.log('✅ Test validationEmail passé : email invalide détecté.');
  }
}


// Test de `setPoint`
async function testSetPoint() {
  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    user.setPoint(50);
    console.log('✅ Test setPoint passé :', user.getPoint());
  } catch (error) {
    console.error('❌ Test setPoint échoué :', error);
  }

  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    user.setPoint(-10);
    console.error('❌ Test setPoint échoué : point négatif accepté.');
  } catch {
    console.log('✅ Test setPoint passé : point négatif détecté.');
  }
}

// Test de `setPassword`
async function testSetPassword() {
  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    const newPassword = user.setNewPassword("newSecurePassword123", await PasswordUtil.getSalt());
    console.log('✅ Test setNewPassword passé :', newPassword);
  } catch (error) {
    console.error('❌ Test setNewPassword échoué :', error);
  }

  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    user.setPassword('short');
    console.error('❌ Test setPassword échoué : mot de passe trop court accepté.');
  } catch {
    console.log('✅ Test setPassword passé : mot de passe trop court détecté.');
  }
}

// Test de `setNbVictoire`
async function testSetNbVictoire() {
  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    user.setNbVictoire(3);
    console.log('✅ Test setNbVictoire passé :', user.getNbVictoire());
  } catch (error) {
    console.error('❌ Test setNbVictoire échoué :', error);
  }

  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    user.setNbVictoire(-1);
    console.error('❌ Test setNbVictoire échoué : nbVictoire négatif accepté.');
  } catch {
    console.log('✅ Test setNbVictoire passé : nbVictoire négatif détecté.');
  }
}

// Test de `setNbPartie`
async function testSetNbPartie() {
  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    user.setNbPartie(3);
    console.log('✅ Test setNbPartie passé :', user.getNbPartie());
  } catch (error) {
    console.error('❌ Test setNbPartie échoué :', error);
  }

  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    user.setNbPartie(-1);
    console.error('❌ Test setNbPartie échoué : setNbPartie négatif accepté.');
  } catch {
    console.log('✅ Test setNbPartie passé : setNbPartie négatif détecté.');
  }
}

// Test de `setPremium`
async function testSetPremium() {
  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    user.setPremium(true);
    console.log('✅ Test setPremium passé : ', user.getPremium());
  } catch (error) {
    console.error('❌ Test setPremium échoué :', error);
  }
}

// Test de `setPhotoProfil`
async function testSetPhotoProfil() {
  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    user.setPhotoProfil(1);
    console.log('✅ Test setPhotoProfil passé : ' , user.getPhotoDeProfil());
  } catch (error) {
    console.error('❌ Test setPhotoProfil échoué :', error);
  }

  try {
    const user = await User.createFullUser('validPseudo', 'valid@example.com', 'validPassword123', 'salt', 0, 0, 0, false, 1);
    const newPhoto = user.setPhotoProfil(-1);
    console.error('❌ Test setPhotoProfil échoué : photo de profil interdit accepté.');
  } catch {
    console.log('✅ Test setPhotoProfil passé : photo de profil interdit détecté.');
  }
}