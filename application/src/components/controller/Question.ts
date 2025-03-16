import Question from '@/components/model/Questions';
import API from './ServerConnection';
import Category from '../model/Category';

/**
* Question Manager to handle the retrieval, processing, and verification of answers for different types of questions.
*/
export default class QuestionManager {
  /**
  * The current question
  * @type {Question | null}
  */
  private question: Question | null = null;
  
  /**
  * The correct answer for the current question
  * @type {string}
  */
  private correctAnswer: string = '';


  /**
  * The possible answers for the current question.
  * @type {any[]}
  */
  private possibleAnswers: string[] = [];

  /**
  * Empty constructor.
  */
  constructor(){ }









  /* FETCH QUESTION */


  /**
  * Retrieves a random question via the {@link API} class.
  * @returns {Question} A random question.
  */
  public getOneQuestion() : Question {
    const randomQuestion = API.getRandomQuestion();
    return randomQuestion;
  }

  /**
  * Allow to fetch a random question by a specific category.
  * The question will be put in the global attribut (this.question)
  * @param category The category of question we want
  * @return {Question} A random for this {@link Category}
  */
  public fetchRandomQuestionByCategory(category: Category) : Question{
    do{
      this.question = this.getOneQuestion();
    } while(this.question.category != category);

    this.possibleAnswers = [];

    console.log("Catégorie : ", this.question.category);

    this.answerTypeSelector();

    return(this.question);
  }

  /**
  * Allow to fetch a random question.
  * The question will be put in a global attribut (this.question)
  * 
  * @return A random {@link Question}.
  */
  public fetchRandomQuestion() : Question {

    do{
      this.question = this.getOneQuestion();
    } while(this.question.typeReponse != "QCM" && this.question.typeReponse != "VF" &&
      this.question.typeReponse != "RDS" && this.question.typeReponse != "RCV");

    this.possibleAnswers = [];

    this.answerTypeSelector();

    return(this.question)
  }








  /* TREAT CORRECT ANSWER AND POSSIBLE ANSWERS */




  /**
  * Handles the question answers, possible answers, and correct answers based on the type of question.
  */
  private answerTypeSelector(){
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

    const cleanedAnswers = this.question?.answer?.split('|').map(answer => answer.trim()) || [];
    this.correctAnswer = cleanedAnswers[0] || '';

    this.possibleAnswers = [...cleanedAnswers];

    for (let i = this.possibleAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.possibleAnswers[i], this.possibleAnswers[j]] = [this.possibleAnswers[j], this.possibleAnswers[i]];
    }

    console.log("Question : ", this.question?.question);
    console.log("Bonne réponse : ", this.correctAnswer);
    console.log("Réponse mélangé : ", this.possibleAnswers);
  }

  /**
  * Processes the question if it is of type VF (True or False).
  */
  private questionIsVF(){
    console.log(" *** VF *** ");

    this.correctAnswer = this.question?.answer === 'Vrai' ? 'Vrai' : 'Faux';
    this.possibleAnswers.push("Vrai");
    this.possibleAnswers.push("Faux");
    
    console.log("Question : ", this.question?.question);
    console.log("Bonne Réponse : ", this.correctAnswer);
  }

  /**
  * Processes the question if it is of type RDS (String Answer).
  */
  private questionIsRDS(){
    console.log(" *** RCV *** ");

    this.possibleAnswers = this.question?.answer.split('|').map(answer => answer.trim()) || [];

    console.log("Question : ", this.question?.question);
    console.log("Bonne Réponses possibles : ", this.possibleAnswers);
  }

  /**
  * Processes the question if it is of type RCV (Numeric Answer).
  */
  private questionIsRCV(){
    //console.log(" *** RCV *** ");

    this.possibleAnswers = this.question?.answer.split('|').map(answer => answer.trim()) || [];

    console.log("Question : ", this.question?.question);
    console.log("Bonne Réponses : ", this.possibleAnswers);
  }

  /**
  * Processes the question if it is of type RLD2 (Fill-in-the-Blank).
  */
  private questionIsRLD2() {
    console.log(" *** RLD2 *** ");

    
    if (!this.question?.answer) {
        console.error("Erreur : 'answer' est undefined ou invalide.");
        this.possibleAnswers = [];
        return;
    }

    this.possibleAnswers = this.question.answer
        .split('|')
        .map(answer => answer.trim())
        .filter(part => /^\d+(\.\d+)?$/.test(part));

    console.log("Question : ", this.question.question);
    console.log("Réponses attendues (nombres uniquement) : ", this.possibleAnswers);
  }







    /* CHECK player ANSWERS FROM THE VIEW */




  /**
  * Method for verifying the player's answer when the player must choose one answer from multiple options.
  * @param userAnswer The player's answer.
  * @returns True if the answer is correct, false otherwise.
  */
  public checkSelectionAnswer(userAnswer: string): boolean {
    return userAnswer === this.correctAnswer;
  }

  /**
  * Method for verifying the player's answer when the player must type the answer in an input field.
  * @param userAnswer The player's answer.
  * @returns True if the answer is correct, false otherwise.
  */
  public checkTextAnswer(userAnswer: string): boolean {
    const possibleAnswers = this.possibleAnswers.map(answer => answer.trim().toLowerCase());

    userAnswer = userAnswer.trim().toLowerCase();
  
    const isCorrect = possibleAnswers.some(answer => answer === userAnswer);
    
    //console.log("Est Correct : " + isCorrect);
  
    return isCorrect;
  }

  /**
  * Method for verifying the player's answers when the player must provide multiple answers.
  * @param userAnswers An array of the player's answers.
  * @returns True if all the answers are correct, false otherwise.
  */
  public checkMultipleTextAnswers(userAnswers: string[]): boolean {
    const sortedUserAnswers = userAnswers.map(answer => answer.trim().toLowerCase()).sort();
    const sortedPossibleAnswers = this.possibleAnswers.map(answer => answer.trim().toLowerCase()).sort();

    const isCorrect = JSON.stringify(sortedUserAnswers) === JSON.stringify(sortedPossibleAnswers);

    //console.log("Est correct : ", isCorrect);

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
  * Returns the possible answers for the current question.
  * @returns An array of possible answers.
  */
  public getPossibleAnswers(){
    return this.possibleAnswers;
  }
}