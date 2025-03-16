import Tile from "./Tile";
import Category from "./Category";
import {randomInt} from "../util/general-utils";

export default class Board{
    /** The size of the board */
    private _size = 0;
    /** The first Tile*/
    private _1stTile : Tile;
    /** The default dice for the board */
    private _defaultDice = 10;

    

    /**
     * Create a new empty board with a d10
     */
    constructor();
    /**
     * Create a new empty board with a dice with a choosen max number
     * @param d the max number of the dice; set to -1 for a random max number
     */
    constructor(d : number);

    constructor(d? : number) {
    
        this._1stTile = new Tile(Category.Centre); 

        if(d != null){
            if(d > 0){
                this._defaultDice =d;
            }else if (d === -1){
                this._defaultDice = randomInt(1,20);
            }
        } 
    }

    /**
     * Load the Board from a map easy to store
     * @param map 
     */
    public static loadFromMap(map : Map<Tile,Array<Tile>>) : Board{
        let nbCenter = Board.hasCentreCategory(map);
        if(nbCenter.length <= 0) throw new LoadingError("No center on the map");
        let b = new Board();
        b._1stTile = nbCenter[0];
        map.forEach((value: Array<Tile>, key: Tile) => {
            b.addTile(key.category,value)
        });
        return b;
    }

    
    /**
     * Check if the board have a Center {@link Category}
     * @param map the board in map form
     * @returns a Array of the Center {@link Tile}
     */
    private static hasCentreCategory(map: Map<Tile, Array<Tile>>): Array<Tile> {
        let result = [];
        for (let tile of map.keys()) {
          if (tile.category === Category.Centre) {
            result.push(tile);
          }
        }
      
        return result;
      };


    /**
     * Get the dice of the board
     */
    public get boardDice(){
        return this._defaultDice;
    }

    /**
     * Add a new tile
     * @param c the category of the new tile
     * @param n the neighbors of the new tile
     * @returns the new tile
     */
    public addTile(c: Category ,n: Array<Tile>) : Tile {
        //TODO mettre un set au lieu d'un array
        let t = new Tile(c,n);
        n.forEach(element => {
            element.addNeighbor(t);
        });
        this._size++;
        return t;
    }




    /**
     * Get the size of the board
     */
    public get size(){
        return this._size;
    }

    /**
     * Get the firstTile Tile
     */
    public get firstTile(){
        return this._1stTile;
    }

    /**
     * Default toString method
     * @returns a human readable string of the object 
     */
    toString() : string{
        let r : string = `Board size = ${this._size}\n`;
        r += this._1stTile;
        return r;
    }
}

