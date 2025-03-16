import { Action } from "../model/Action";
import Board from "../model/Board";
import Player from "../model/Player";
import Tile from "../model/Tile";
import { all } from "../ActionPlaySet";
import Category from "../model/Category";

export default class Round{
    private _turnNb : number = 0; 
    private _board : Board;
    private _players : Array<Player>;
    private _actions : Array<Action>;
    private _requiredPoints : number = 20;
    private _currentAction? : Action = undefined;
    /**
     * To check if the function were called in the good order
     * -1 -> not started
     * 0 -> before scanning the {@link Tile} where the player can move
     * 1 -> before the player moved
     * 2 -> before the action
     * 3 -> before getting the question
     * 4 -> before processing the answer a.k.a. giving the points to the players and checking if someone won
     */
    private _turn = -1;
    

    /**
     * Create a new Round with all of the {@link Action}
     * @param d the max number a player can roll
     * @param board the board
     */
    constructor(d : number, board : Map<Tile,Array<Tile>>);
    /**
     * Create a new Round with a custom playset of {@link Action}
     * @param d the max number a player can roll
     * @param board the board
     * @param action the action playset
     */
    constructor(d : number, board : Map<Tile,Array<Tile>>,action : Array<Action>);

    constructor(d = 10, board? : Map<Tile,Array<Tile>>, action? : Array<Action>){
        //check for the board
        if(board != null){
            try{
                this._board = Board.loadFromMap(board);
            }catch{
                this._board = new Board(d);
            }
        }else{
            this._board = new Board(d);
        }

        //check for the action
        if(action != null)
            this._actions = [...action];
        else
            this._actions = [...all];

        this._players = new Array();
        this._actions.forEach(e =>{
            e.round = this;
        });
    }

    /** 
     * Add a player to the round
     * @param p the player
     * @throws {GameAlreadyInProgressError} if the round is already in progress
     */
    public addPlayer(p : Player){
        if(this._turn !== -1) throw new GameAlreadyInProgressError();
        if(this._players.includes(p)) throw new NoPlayerError();
        p.dice = this._board.boardDice;
        p.position = this._board.firstTile;
        this._players.push(p);
        this._players.sort((a,b) => {
            if(a.totalPoints < b.totalPoints){
                return -1;
            }
            if(a.totalPoints > b.totalPoints){
                return 1;
            }
            return 0;
        });
    }



    /**
     * Start the turn of a player
     * The {@link turn} need to be -1
     * @returns the {@link Player}
     */
    public startTurn() : Player {
        if(this._turn !== -1) throw new OutOfOrderError("wrong time to start");
        let player = this.currentPlayer;
        console.log("turn of :"+player);
        this._turn = 0;
        return player;
    }

    // need turn to be 0
    /**
     * Scan where the player can move
     * @throws {OutOfOrderError} if {@link turn} is not 0
     * @returns 
     */
    public scan(numberOfMovement : number) : Array<Tile> {
        if(numberOfMovement <= 0) throw new Error("Number of movement negative or 0"); 
        console.log("round scanning turn",this._turn);
        if(this._turn !== 0) throw new OutOfOrderError("wrong time to scan"); 
        this._turn = 1;
        return this.currentPlayer.scan(numberOfMovement);
    }


    /**
     * Called after the {@link Player} made its choice from the {@link scan} function
     * @throws {OutOfOrderError} if {@link turn} is not 1
     * @param t the tile they chose
     */
    public moveTile(t : Tile) : Action{
        console.log("moveTile",this._turn);
        if(this._turn !== 1) throw new OutOfOrderError("wrong time to move");
        let c = this.currentPlayer.moveToTile(t);
        this._currentAction = this.piocheAction();
        this._turn = 2;
        return this._currentAction;
    }

    //do the action check here, like choosing someone
    //need turn to be 2
    /**
     * 
     * @throws {OutOfOrderError} if {@link turn} is not 2
     */
    public action(){
        console.log("action",this._turn);
        if(this._turn !== 2) throw new OutOfOrderError("wrong time to action");
        if(this._currentAction == null) throw new Error("no Action?");
        this._currentAction.before();// called before the question
        this._turn = 3;
    }

    //need turn to be 3
    /**
     * 
     * @throws {OutOfOrderError} if {@link turn} is not 3
     * @param c 
     */
    public avoirQuestion(c : Category){
        console.log("avoirQuestion",this._turn);
        if(this._turn !==3) throw new OutOfOrderError("wrong to time to question");
        

        //TODO link with the question

        this._turn = 4;
    }

    /**
     * return true if the round is finished
     * @throws {OutOfOrderError} if {@link turn} is not 4
     */
    public postAnswer(answer : boolean) : boolean {
        if(this._turn !== 4) throw new OutOfOrderError("wrong to time postanswered");
        if(this._currentAction == null) throw new Error("no Action picked");
        this._currentAction.answer(); //called after answering
        let attributeAnswer;
        if(answer){
            attributeAnswer = this._currentAction.win();
        }else{
            attributeAnswer = this._currentAction.lose();
        }

        attributeAnswer.forEach( (v,k) =>{
            k.points += v;
        });

        let a = this.didSomeoneWon();
        console.log("did someone won? ",a.length > 0);
        
        if(a.length === 1){
            return true;
        }
        //multiple winners continuing the round
        if(a.length > 1){
            console.log("multiple winners continue the round");
            this.requirePoints += 1;
        }
        
        this._turn = 0;
        this._currentAction = undefined;
        this._turnNb++;
        return false;
    }

    /**
     * Get the require points to win
     */
    public get requirePoints() : number{
        return this._requiredPoints;
    }

    /**
     * Get a random {@link Action} from the current playset
     * @returns a {@link Action} 
     */
    private piocheAction() : Action {
        return this._actions[Math.floor(Math.random()*this._actions.length)];
    }


    public set requirePoints(pts : number){
        this._requiredPoints = pts;
        this._players.forEach(e => {
            e.requiredPoints = pts;
        });
    }

    /**
     * Check if someone won this turn
     * @returns a Array of Player who won
     */
    private didSomeoneWon() : Array<Player>{ 
        let result = new Array<Player>();
        for(let p of this._players){
            if(p.won()){
                result.push(p);
            }
        }
        return result;
    }

    /**
     * Get the player who got less points than the current player
     */
    public get playerBefore(){
        let i = this._turnNb%this._players.length -1;
        if(i === -1) 
            i = this._players.length -1;

        return this._players[i];
    }

    /**
     * Get the player who got more points than the current player
     */
    public get playerAfter(){
        let i = this._turnNb%this._players.length +1 ;
        if(i >= this._players.length ) 
            i = 0;
        return this._players[i];
    }


    /**
     * Get the {@link Player} whose playing its turn  
     */
    public get currentPlayer() : Player{
        if(this._turn === -1) throw new NoGameInProgressError();
        return this._players[this._turnNb%this._players.length];
    }

    /**
     * Get the list of Players in the {@link Round}
     */
    public get players(){
        return [...this._players];
    }

    /**
     * Get the dice used in the {@link Round}
     */
    public get dice(){
        return this._board.boardDice;
    }

    /**
     * Check if the round is in progress
     */
    public get inProgress(){
        return this._turn !== -1;
    }

    public get turn(){
        return this._turn;
    }

}