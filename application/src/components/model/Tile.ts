import Category from "./Category";
export default class Tile{
    /** The neighbors of the tile */
    private _neighbors: Array<Tile>;
    /** Category of the tile */
    private _category: Category;

    /**
     * Create a tile with only the category with no neighbors
     * @param category the category of the tile
     */
    constructor(category : Category);
    /**
     * Create a tile
     * @param category the category of the tile 
     * @param neighbors the neighbors of the tile
     */
    constructor(category : Category, neighbors : Array<Tile>);

    constructor(category : Category, neighbors? : Array<Tile>){
        this._category = category;
        let n = Object.assign([], neighbors); // to clone the array
        this._neighbors = n ?? new Array<Tile>;
    }

    /**
     * Get the neighbors of the tile.
     * If you want to add a neighbors use the {@link addNeighbor}
     */
    public get neighbors(){
        return [...this._neighbors];
    }

    /**
     * Get the category of the tile
     */
    public get category(){
        return this._category;
    }

    /**
     * Add a neighbor to the current tile 
     * @param t the neigbor to add
     */
    public addNeighbor(t : Tile) : void{
        if(!this._neighbors.includes(t))
            this._neighbors.push(t);
    }

    /**
     * Default toString method
     * @returns a human readable string of the object 
     */
    toString(): string{
        return this._category.toString();
    }

    


}