import Category from "@/Type/Category";

/**
 * Represents a question with its associated properties, including its category, answer, 
 * image (optional), and correction details.
 * 
 * @class Question
 */
export default class Question {
    /**
     * Unique identifier for the question.
     * @type {number}
     */
    private _id: number;

    /**
     * Category of the question.
     * @type {Category}
     */
    private _category: Category;

    /**
     * The text of the question.
     * @type {string}
     */
    private _question: string;

    /**
     * The correct answer to the question.
     * @type {string}
     */
    private _answer: string;

    /**
     * Optional image associated with the question.
     * @type {string | undefined}
     */
    private _img?: string;

    /**
     * Correction or explanation related to the question's answer.
     * @type {string}
     */
    private _correction: string;

    /**
     * The type of response expected for the question (e.g., "multiple choice", "true or false").
     * @type {string}
     */
    private _typeReponse: string;

    /**
     * Creates an instance of Question.
     * 
     * @constructor
     * @param {number} id - Unique identifier for the question.
     * @param {Category} category - The category associated with the question.
     * @param {string} question - The question text.
     * @param {string} answer - The correct answer to the question.
     * @param {string} img - Optional image associated with the question.
     * @param {string} correction - Explanation or correction for the question.
     * @param {string} typeReponse - The type of response expected.
     */
    constructor(
        id: number,
        category: Category,
        question: string,
        answer: string,
        img: string,
        correction: string,
        typeReponse: string
    ) {
        this._id = id;
        this._category = category;
        this._answer = answer;
        this._question = question;
        this._img = img;
        this._correction = correction;
        this._typeReponse = typeReponse;
    }

    /**
     * Gets the unique identifier for the question.
     * 
     * @type {number}
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Gets the type of response expected for the question.
     * 
     * @type {string}
     */
    public get typeReponse(): string {
        return this._typeReponse;
    }

    /**
     * Gets the correction or explanation related to the question's answer.
     * 
     * @type {string}
     */
    public get correction(): string {
        return this._correction;
    }

    /**
     * Gets the question text.
     * 
     * @type {string}
     */
    public get question(): string {
        return this._question;
    }

    /**
     * Gets the correct answer to the question.
     * 
     * @type {string}
     */
    public get answer(): string {
        return this._answer;
    }

    /**
     * Gets the category of the question.
     * 
     * @type {Category}
     */
    public get category(): Category {
        return this._category;
    }

    /**
     * Gets the optional image associated with the question.
     * 
     * @type {string | undefined}
     */
    public get img(): string | undefined {
        return this._img;
    }
}