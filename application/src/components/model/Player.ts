import Tile from "./Tile";
import Category from "./Category";
import {randomInt} from "../util/general-utils";
export default class Player{
    /**Name of the player */
    private _name : string;
    /** The position of the player */
    private _position? : Tile = undefined;
    /** The points of the player by category {@link Category}  */
    private _pointsByCategory : number[] = [];
    /** The points of the player in this round */
    private _point = 0;
    /** The totalPoints of the user */
    private _totalPoints = -1;
    /** The current max number the player can make */
    private _dice = 10; 
    /** The required points to win */
    private _requiredPoints = 20;

    /**
     * Create a new player
     */
    constructor(name : string){   
        this._name = name;
    } 
    /**
     * Set the max number a player can make with the dice
     */
    public set dice(d : number){
        this._dice = d;
    }

    /**
     * Start function of the recursive {@link moveToNextTile}
     * @param mvtLeft the number of tile the player can move
     * @returns an array of {@link Tile} where the player can move
     */
    private possibilityOfMovement(mvtLeft : number) : Array<Tile>{
        if(this._position == null) throw new Error("joueur non placé");
        let a : Array<Tile> = [];
        a.push(this._position);

        let resultDupli : Array<Tile> = this.moveToNextTile(mvtLeft -1,this._position,a);
        
        let result = resultDupli;
        result.forEach(e => console.log(e.category));

        return [...result];
    }

    /**
     * The recursive function for the movement of a player
     * @param mvtLeft the number of tile left to move
     * @param current the current tile
     * @param goneThrough the path of the player
     * @returns an array of {@link Tile} where the player can move
     */
    private moveToNextTile(mvtLeft : number, current : Tile, goneThrough : Array<Tile>): Array<Tile>{
        let result: Set<Tile> = new Set();

        
        current.neighbors.forEach(next => {
    
            // Check if we have already visited this tile
            if (!goneThrough.includes(next)) {
    
                // Clone the path to include the current tile
                let goneThroughClone: Array<Tile> = [...goneThrough, next];
    
                if (mvtLeft > 0) {
                    // Continue exploring from the next tile with decremented movement
                    const nextTiles = this.moveToNextTile(mvtLeft - 1, next, goneThroughClone);
                    nextTiles.forEach(tile => result.add(tile));
                } else {
                    // If no movement is left, add the current tile to the result
                    result.add(next);
                }
            }
        });
    
        const finalResult = Array.from(result);
        
        return finalResult;
    }
    
    
    /**
     * Move with a choosen dice roll
     * @param diceRoll the number of a {@link Tile} a player can move
     */
    public scan(diceRoll : number) : Array<Tile>;
    
    /**
     * Move with the dice of the game
     */
    public scan() : Array<Tile>;

    /**
     * First part of the scanment of a player
     * @returns an array of tile where the player could go
     */
    public scan(diceRoll? : number): Array<Tile> {
        let mvt = randomInt(1, this._dice);
        if(diceRoll != null)
            mvt = diceRoll;
        console.log("Random movement value:", mvt);
    
        // Obtain movement possibilities
        const movementOptions = this.possibilityOfMovement(mvt);
        
        // Convert to a unique array to prevent any persistent data contamination
        const uniqueResults = [...new Set(movementOptions.map(tile => tile))];
    
        console.log("Unique movement options:", uniqueResults.length);
        uniqueResults.forEach(tile => console.log(`Tile: ${tile.category}`));
    
        return [...uniqueResults];
    }


    /**
     * Used after the player chose a tile to go from the {@link move} function
     * @param t the tile the player will move to
     * @returns the category of the tile
     */
    public moveToTile(t : Tile) : Category{
        this.position = t;
        return t.category;
    }


    public won() : boolean{
        return this.wonByPoints() || this.wonByCategory();
    }


    private wonByCategory() :boolean{
        let result = true;
        let i = 0;
        while(!result && i >= this._pointsByCategory.length ){
            if(this._pointsByCategory[i] === 0){
                result = false;
            }
        }
        return result;
    }

    private wonByPoints() : boolean{
        return this._point >= this._requiredPoints;
    }



    /**
     * Get the position of the player
     */
    public get position() : Tile | undefined{
        return this._position;
    }

    /**
     * Get the points by their category
     */
    public get pointCategory() {
        return [...this._pointsByCategory];
    }

    /**
     * Get the points of the player
     */
    public get points(){
        return this._point;
    }

    public set points(p : number){
        this._point =p;
    }

    /**
     * Get the total points of the player 
     */
    public get totalPoints(){
        return this._totalPoints;
    }
    
    /**
     * Set the total points of the player
     */
    public set totalPoints(points : number){
        this._totalPoints = points;
    }

    /**
     * Set the position of the player
     * This should NOT be used to make a player move, instead use {@link move}
     */
    public set position(t : Tile){
        this._position = t;
    }


    public get requiredPoints(){
        return this._requiredPoints;
    }

    set requiredPoints(m : number){
        this._requiredPoints = m;
    }
    
    /**
     * Default toString method
     * @returns a human readable string of the object 
     */

    public toString() : string{
        return this._name;
    }
}