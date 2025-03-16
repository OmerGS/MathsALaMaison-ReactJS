import CryptoJS from 'crypto-js';

/**
* Classe utilitaire pour gérer les opérations sur les mots de passe, 
* y compris la génération de sel et le chiffrement des mots de passe.
*/
export class PasswordUtil {

  /**
  * Méthode asynchrone permettant de générer un sel.
  * Le sel est un ensemble de données aléatoires ajouté au mot de passe avant le chiffrement 
  * pour renforcer la sécurité et éviter les attaques par dictionnaire.
  *
  * @returns {Promise<string>} - Retourne une promesse qui résout à une chaîne de caractères représentant le sel.
  *
  * @example
  * const salt = await PasswordUtil.getSalt();
  * console.log(salt); // Affiche le sel généré, par exemple : 'k3r6qwzq2wb8z'
  */
  static async getSalt(): Promise<string> {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
  * Méthode permettant de chiffrer un mot de passe à l'aide de l'algorithme SHA-256.
  * Cette méthode combine le mot de passe en clair avec le sel fourni avant de 
  * produire un hash sécurisé.
  *
  * @param {string} password - Le mot de passe en clair à chiffrer.
  * @param {string} salt - Le sel à utiliser pour le chiffrement.
  * 
  * @returns {string} - Retourne le mot de passe chiffré sous forme de chaîne de caractères.
  *
  * @example
  * const hashedPassword = PasswordUtil.hashPassword('MonMotDePasse123', 'monSelAleatoire');
  * console.log(hashedPassword); // Affiche le mot de passe chiffré, par exemple : 'a8c58e7f1f7e15cfb...'
  */
  static hashPassword(password: string, salt: string): string {
    return CryptoJS.SHA256(password + salt).toString();
  }
}