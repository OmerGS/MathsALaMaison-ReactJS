import Question from '@/Type/model/Question';
import Category from '@/Type/Category';
import { getRandomCategoryQuestion, getRandomQuestion } from '@/services/questionAPI';

/**
* Question Manager to handle the retrieval, processing, and verification of reponses for different types of questions.
*/
export default class QuestionManager {
  /**
  * The current question
  * @type {Question | null}
  */
  private question: Question | null = null;
  
  /**
  * The correct reponse for the current question
  * @type {string}
  */
  private correctreponse: string = '';


  /**
  * The possible reponses for the current question.
  * @type {any[]}
  */
  private possiblereponses: string[] = [];

  /**
  * Empty constructor.
  */
  constructor(){ }


  /* FETCH QUESTION */

  public async fetchRandomQuestion() : Promise<Question> {
    const response = await getRandomQuestion();

    this.question = response as Question;

    console.log("Question : ", this.question);

    this.possiblereponses = [];
    this.reponseTypeSelector();

    return this.question;
  }

  public async fetchRandomQuestionByCategory(category: Category) : Promise<Question> {
    const response = await getRandomCategoryQuestion(category);

    this.question = response as Question;
    this.possiblereponses = [];
    this.reponseTypeSelector();

    return this.question;
  }







  /* TREAT CORRECT reponse AND POSSIBLE reponseS */




  /**
  * Handles the question reponses, possible reponses, and correct reponses based on the type of question.
  */
  private reponseTypeSelector(){
    console.log("Réponse Attendu : " + this.question?.typeReponse);

    switch(this.question?.typeReponse){
      case 'QCM':
        this.questionIsQCM();
        break;
      
      case 'VF':
        this.questionIsVF();
        break;

      case 'RDS':
        this.questionIsRDS();
        break;
    
      case 'RCV':
        this.questionIsRCV();
        break;
      /*
      case 'RLD2':
        this.questionIsRLD2();
        break;
        
      case 'RLD3':
        console.log("La réponse attendu est un RLD3");
        break;

      case 'RLD4':
        console.log("La réponse attendu est un RLD4");
        break;

      case 'VFRDS':
        console.log("La réponse attendu est un VFRDS");
        break;

      case 'VFRLD1':
        console.log("La réponse attendu est un VFRLD1");
        break;

      case 'VFRLD2':
        console.log("La réponse attendu est un VFRLD2")
        break;*/
    }

    console.log(" ---------------- ");
  }

  /**
  * Processes the question if it is of type QCM (Multiple Choice Question).
  */
  private questionIsQCM(){
    console.log(" *** QCM *** ");

    const cleanedreponses = this.question?.reponse?.split('|').map(reponse => reponse.trim()) || [];
    this.correctreponse = cleanedreponses[0] || '';

    this.possiblereponses = [...cleanedreponses];

    for (let i = this.possiblereponses.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.possiblereponses[i], this.possiblereponses[j]] = [this.possiblereponses[j], this.possiblereponses[i]];
    }

    console.log("Question : ", this.question?.question);
    console.log("Bonne réponse : ", this.correctreponse);
    console.log("Réponse mélangé : ", this.possiblereponses);
  }

  /**
  * Processes the question if it is of type VF (True or False).
  */
  private questionIsVF(){
    console.log(" *** VF *** ");

    this.correctreponse = this.question?.reponse === 'Vrai' ? 'Vrai' : 'Faux';
    this.possiblereponses.push("Vrai");
    this.possiblereponses.push("Faux");
    
    console.log("Question : ", this.question?.question);
    console.log("Bonne Réponse : ", this.correctreponse);
  }

  /**
  * Processes the question if it is of type RDS (String reponse).
  */
  private questionIsRDS(){
    console.log(" *** RCV *** ");

    this.possiblereponses = this.question?.reponse.split('|').map(reponse => reponse.trim()) || [];

    console.log("Question : ", this.question?.question);
    console.log("Bonne Réponses possibles : ", this.possiblereponses);
  }

  /**
  * Processes the question if it is of type RCV (Numeric reponse).
  */
  private questionIsRCV(){
    //console.log(" *** RCV *** ");

    this.possiblereponses = this.question?.reponse.split('|').map(reponse => reponse.trim()) || [];

    console.log("Question : ", this.question?.question);
    console.log("Bonne Réponses : ", this.possiblereponses);
  }

  /**
  * Processes the question if it is of type RLD2 (Fill-in-the-Blank).
  */
  private questionIsRLD2() {
    console.log(" *** RLD2 *** ");

    
    if (!this.question?.reponse) {
        console.error("Erreur : 'reponse' est undefined ou invalide.");
        this.possiblereponses = [];
        return;
    }

    this.possiblereponses = this.question.reponse
        .split('|')
        .map(reponse => reponse.trim())
        .filter(part => /^\d+(\.\d+)?$/.test(part));

    console.log("Question : ", this.question.question);
    console.log("Réponses attendues (nombres uniquement) : ", this.possiblereponses);
  }







    /* CHECK player reponseS FROM THE VIEW */




  /**
  * Method for verifying the player's reponse when the player must choose one reponse from multiple options.
  * @param userreponse The player's reponse.
  * @returns True if the reponse is correct, false otherwise.
  */
  public checkSelectionreponse(userreponse: string): boolean {
    return userreponse === this.correctreponse;
  }

  /**
  * Method for verifying the player's reponse when the player must type the reponse in an input field.
  * @param userreponse The player's reponse.
  * @returns True if the reponse is correct, false otherwise.
  */
  public checkTextreponse(userreponse: string): boolean {
    const possiblereponses = this.possiblereponses.map(reponse => reponse.trim().toLowerCase());

    userreponse = userreponse.trim().toLowerCase();
  
    const isCorrect = possiblereponses.some(reponse => reponse === userreponse);
    
    //console.log("Est Correct : " + isCorrect);
  
    return isCorrect;
  }

  /**
  * Method for verifying the player's reponses when the player must provide multiple reponses.
  * @param userreponses An array of the player's reponses.
  * @returns True if all the reponses are correct, false otherwise.
  */
  public checkMultipleTextreponses(userreponses: string[]): boolean {
    console.log("Réponses utilisateur : ", userreponses);
    const sortedUserreponses = userreponses.map(reponse => reponse.trim().toLowerCase()).sort();
    console.log("Réponses utilisateur triées : ", sortedUserreponses);
    const sortedPossiblereponses = this.possiblereponses.map(reponse => reponse.trim().toLowerCase()).sort();
    console.log("Réponses possibles triées : ", sortedPossiblereponses);
    const isCorrect = JSON.stringify(sortedUserreponses) === JSON.stringify(sortedPossiblereponses);

    console.log("Est correct : ", isCorrect);

    return isCorrect;
}

  






  /* GETTERS */


  /**
  * Method for getting the current question.
  * @returns The current question.
  */
  public getQuestion(){
    return this.question;
  }

  /**
  * Returns the possible reponses for the current question.
  * @returns An array of possible reponses.
  */
  public getPossiblereponses(){
    return this.possiblereponses;
  }
}