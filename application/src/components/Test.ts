import Board from "./model/Board";
import Category from "./model/Category";
import Player from "./model/Player";
import { debug } from "@/components/BoardsType";
import Tile from "./model/Tile";


function testPlayer(): void{


    const scanNormal = () => {

        let b = Board.loadFromMap(debug);


        let p = new Player("testA");
        p.moveToTile(b.firstTile);
        let attendu = b.firstTile.neighbors;
        let result = p.scan(1);
    
        let r = attendu.every(item => result.includes(item));
        if(!r) throw new Error("scan cas normal");
        console.log("test scan ok");

    }
    const scanLimite = () => {


        let bCarre = new Board();
    
        let ca = new Tile(Category.Calculs, [bCarre.firstTile]);
        let cl = new Tile(Category.CalculLitteral,[bCarre.firstTile,ca]);
        ca.addNeighbor(cl);
        let p = new Player("TestLimite");
        p.moveToTile(bCarre.firstTile);
        let attendu = new Array<Tile>;
        let result = p.scan(3);

        let r = attendu.every(item => result.includes(item));
        if(!r) throw new Error("scan cas limite");
        console.log("test scan limite ok")
    }

    

    scanNormal();
    scanLimite();
}


function testBoard(): void{
    
    const addTile = () =>{
        let b = Board.loadFromMap(debug);

        b.addTile(Category.CalculLitteral,[b.firstTile]);
        let neigh = b.firstTile.neighbors.filter(i => i.category === Category.CalculLitteral);
        if(neigh.length !== 1) throw new Error("addTile cas normal");
        console.log("test addTile normal ok");
    }
    addTile();
}


export {testPlayer, testBoard};
