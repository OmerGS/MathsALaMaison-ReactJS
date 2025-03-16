import { PasswordUtil } from '../util/password-util';

/**
* Class representing a user.
*/
export class User {
    /**
     * The unique identifier of the user.
     * @type {number | undefined}
     */
    private id: number | undefined;

    /**
     * The user's pseudonym.
     * @type {string}
     */
    private pseudo!: string;

    /**
     * The user's email address.
     * @type {string | undefined}
     */
    private email: string | undefined;
    
    /**
     * The user's hashed password.
     * @type {string | undefined}
     */
    private password: string | undefined;
    
    /**
     * The salt used for hashing the password.
     * @type {string | undefined}
     */
    private salt: string | undefined;
    
    /**
     * The number of points the user has earned.
     * @type {number | undefined}
     */
    private point: number | undefined;
    
    /**
     * Indicates whether the user is a premium member.
     * @type {boolean | undefined}
     */
    private isPremium: boolean | undefined;
    
    /**
     * The total number of games the user has played.
     * @type {number | undefined}
     */
    private nombrePartie: number | undefined;
    
    /**
     * The total number of games the user has won.
     * @type {number | undefined}
     */
    private nombreVictoire: number | undefined;
    
    /**
     * The user's profile picture identifier.
     * @type {number | undefined}
     */
    private photoProfil: number | undefined;

    
    
    /* CREATE INSTANCE */

    /**
     * Private constructor for creating a new User instance.
     * 
     * @private
     * @param {string} pseudo - The user's pseudonym.
     * @param {string} email - The user's email address.
     * @param {string} plainPassword - The user's plain text password.
     * @param {string} salt - The salt used for hashing the password.
     * @param {number} point - The initial number of points for the user.
     * @param {number} nbPartie - The total number of games played.
     * @param {number} nbVictoire - The total number of games won.
     * @param {boolean} isPremium - Whether the user is a premium member.
     * @param {number} photoProfil - The user's profile picture identifier.
     */
    private constructor(
        pseudo: string, 
        email: string, 
        plainPassword: string, 
        salt: string, 
        point: number, 
        nbPartie: number, 
        nbVictoire: number, 
        isPremium: boolean, 
        photoProfil: number
    )
    {
        this.setPseudo(pseudo);
        this.setEmail(email);
        this.setNewPassword(plainPassword, salt);
        this.setPoint(point);
        this.setNbPartie(nbPartie);
        this.setNbVictoire(nbVictoire);
        this.setPremium(isPremium);
        this.setPhotoProfil(photoProfil);
    }

    /**
     * Factory method for creating a basic User instance.
     * 
     * @static
     * @param {string} pseudo - The user's pseudonym.
     * @param {string} email - The user's email address.
     * @param {string} plainPassword - The user's plain text password.
     * @returns {Promise<User>} The created User instance.
     */
    public static async createUser(pseudo: string, email: string, plainPassword: string): Promise<User> {
        const salt = await PasswordUtil.getSalt();
        
        return new User(pseudo, email, plainPassword, salt, 0, 0, 0, true, 1);
    }


    /**
     * Factory method for creating a User instance with full data.
     * 
     * @static
     * @param {string} pseudo - The user's pseudonym.
     * @param {string} email - The user's email address.
     * @param {string} plainPassword - The user's plain text password.
     * @param {string} salt - The salt for hashing the password.
     * @param {number} point - The user's points.
     * @param {number} nbPartie - The number of games played.
     * @param {number} nbVictoire - The number of games won.
     * @param {boolean} isPremium - Whether the user is a premium member.
     * @param {number} photoProfil - The user's profile picture identifier.
     * @returns {Promise<User>} The created User instance.
     */
    public static async createFullUser(
        pseudo: string,
        email: string,
        plainPassword: string,
        salt: string,
        point: number,
        nbPartie: number,
        nbVictoire: number,
        isPremium: boolean,
        photoProfil: number
    ): Promise<User> {
        
        return new User(pseudo, email, plainPassword, salt, point, nbPartie, nbVictoire, isPremium, photoProfil);
    }



    /* GETTER */
    
    /**
     * Gets the user's unique identifier.
     * @returns {number | undefined} The user's ID.
     */
    public getId(): number | undefined {
        return(this.id);
    }

    /**
     * Gets the user's pseudonym.
     * @returns {string | undefined} The user's pseudonym.
     */
    public getPseudo(): string | undefined {
        return(this.pseudo);
    }

    /**
     * Gets the user's email address.
     * @returns {string | undefined} The user's email address.
     */
    public getEmail(): string | undefined {
        return(this.email);
    }

    /**
     * Gets the user's hashed password.
     * @returns {string | undefined} The user's hashed password.
     */
    public getPassword(): string | undefined {
        return(this.password);
    }

    /**
     * Gets the salt used for hashing the user's password.
     * @returns {string | undefined} The salt value.
     */
    public getSalt(): string | undefined {
        return(this.salt);
    }

    /**
     * Gets the user's points.
     * @returns {number | undefined} The number of points the user has.
     */
    public getPoint(): number | undefined {
        return(this.point);
    }

    /**
     * Checks if the user is a premium member.
     * @returns {boolean | undefined} True if the user is a premium member, otherwise false.
     */
    public getPremium(): boolean | undefined {
        return(this.isPremium);
    }

    /**
     * Gets the total number of victories the user has.
     * @returns {number | undefined} The number of victories.
     */
    public getNbVictoire(): number | undefined {
        return(this.nombreVictoire);
    }

    /**
     * Gets the total number of games the user has played.
     * @returns {number | undefined} The number of games played.
     */
    public getNbPartie(): number | undefined {
        return(this.nombrePartie);
    }

    /**
     * Gets the user's profile picture identifier.
     * @returns {number | undefined} The identifier of the profile picture.
     */
    public getPhotoDeProfil(): number | undefined {
        return(this.photoProfil);
    }





    /* SETTER */
    
    /**
     * Sets the user's unique identifier.
     * @param {number} newId - The new ID to set.
     * @throws {Error} If the ID is less than 0.
     */
    private setId(newId: number): void {
        if(newId < 0){
            throw new Error("id doit être superieur à 0");
        }

        this.id = newId;
    }

    /**
     * Sets the user's pseudonym.
     * @param {string} newPseudo - The new pseudonym to set.
     * @throws {Error} If the pseudonym is invalid or does not meet length and character requirements.
     */
    public setPseudo(newPseudo: string): void {
        const pseudoPattern = /^[a-zA-Z0-9À-ÖØ-öø-ÿ@._\-]+$/;
        
        if (!newPseudo) {
            throw new Error("Erreur : Pseudo null");
        } 
        else if (newPseudo.length > 16) {
            throw new Error("Erreur : Pseudo plus long que 16 caractères");
        } else if (newPseudo.length < 2){
            throw new Error("Erreur : Pseudo doit au moins faire 2 caractères");
        } else if (!pseudoPattern.test(newPseudo)){
            throw new Error("Erreur : Caractères invalide dans le pseudo.");
        }
        else if (!newPseudo.trim() || !/^[^\s]+$/.test(newPseudo)) {
            throw new Error("Erreur : pas d'espace possible dans le pseudo");
        }

        this.pseudo = newPseudo;
    }

    /**
     * Sets the user's email address.
     * @param {string} newEmail - The new email address to set.
     * @throws {Error} If the email is invalid or exceeds 64 characters.
     */
    public setEmail(newEmail: string): void {
        const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!newEmail) {
            throw new Error("Erreur : email null !");
        } 
        else if (newEmail.length > 64) {
            throw new Error("Erreur : email trop long (plus de 64 caractères) !");
        } 
        else if((!emailPattern.test(newEmail))){
            throw new Error("Erreur : email invalide !");
        }

        this.email = newEmail;
    }

    /**
     * Sets the user's new password with hashing.
     * @param {string} plainPassword - The plain text password.
     * @param {string} salt - The salt used for hashing the password.
     * @returns {string} The hashed password.
     * @throws {Error} If the password is shorter than 10 characters.
     */
    public setNewPassword(plainPassword: string, salt: string): string {
        if (plainPassword.length < 10) {
            throw new Error("Mot de passe trop court, il doit contenir au moins 10 caractères.");
        }

        this.password = PasswordUtil.hashPassword(plainPassword, salt); 
        this.salt = salt;

        return this.password;
    }

    /**
     * Sets the user's plain text password without hashing.
     * @param {string} plainPassword - The plain text password to set.
     * @throws {Error} If the password is shorter than 10 characters.
     */
    public setPassword(plainPassword: string): void {
        if (plainPassword.length < 10) {
            throw new Error("Mot de passe trop court, il doit contenir au moins 10 caractères.");
        }
        
        this.password = plainPassword;
    }

    /**
     * Sets the salt used for password hashing.
     * @param {string} newSalt - The new salt value.
     * @throws {Error} If the salt is null or undefined.
     */
    public setSalt(newSalt: string): void {
        if(!newSalt){
            throw new Error("Le sel ne doit pas être null");
        }

        this.salt = newSalt;
    }

    /**
     * Sets the user's points.
     * @param {number} newPoint - The number of points to set.
     * @throws {Error} If the points are less than 0.
     */
    public setPoint(newPoint: number): void {
        if(newPoint < 0){
            throw new Error("Le nombre de point doit être positive");
        }

        this.point = newPoint;
    }

    /**
     * Sets whether the user is a premium member.
     * @param {boolean} newState - The premium status to set.
     */
    public setPremium(newState: boolean): void {
        this.isPremium = newState;
    }

    /**
     * Sets the total number of games played by the user.
     * @param {number} nbPartie - The number of games played.
     * @throws {Error} If the number is less than 0.
     */
    public setNbPartie(nbPartie: number): void {
        if(nbPartie < 0){
            throw new Error("Le nombre de partie ne doit pas être inferieur à 0");
        }
        
        this.nombrePartie = nbPartie;
    }

    /**
     * Sets the total number of victories the user has.
     * @param {number} nbVictoire - The number of victories to set.
     * @throws {Error} If the number is less than 0.
     */
    public setNbVictoire(nbVictoire: number): void {
        if(nbVictoire < 0){
            throw new Error("Le nombre de victoire ne doit pas être inferieur à 0");
        }
        
        this.nombreVictoire = nbVictoire;
    }

    /**
     * Sets the user's profile picture identifier.
     * @param {number} newPhoto - The new profile picture identifier.
     * @throws {Error} If the identifier is less than 0.
     */
    public setPhotoProfil(newPhoto: number): void {
        if(newPhoto < 0){
            throw new Error("La photo de profil ne doit pas être inferieur à 0");
        }

        this.photoProfil = newPhoto;
    }
}