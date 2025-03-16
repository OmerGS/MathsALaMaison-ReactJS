import Category from "./model/Category";
import Tile from "./model/Tile";


const createBulkTiles = function (nb : number, c : Category) : Tile[] {
    let result = new Array<Tile>;
    for(let i = 0; i < nb;i++){
        result.push(new Tile(c));
    }

    return result;
};



let centre = new Tile(Category.Centre);
let t = createBulkTiles(6,Category.Transformation);
let co = createBulkTiles(6,Category.Communiquer);
let p = createBulkTiles(6,Category.Proportionnalite);
let e = createBulkTiles(6,Category.Espace);
let n = createBulkTiles(6,Category.Nombres);
let i = createBulkTiles(6,Category.Informatique);
let cl = createBulkTiles(6,Category.CalculLitteral);
let g = createBulkTiles(6,Category.Geometrie);
let ca = createBulkTiles(6,Category.Calculs);
let l = createBulkTiles(6,Category.Logique);
let sop = createBulkTiles(6,Category.StatOuProbas);
let f = createBulkTiles(6,Category.Fonctions);

const board1 = new Map<Tile,Array<Tile>>([
       [centre,[t[2],l[1],sop[2],i[2],e[2],n[2],g[3],cl[3],p[3],f[3],co[4],ca[4]]],
       //1er liaison
       [t[2],[centre,p[1]]],
       [p[1],[t[2],f[0]]],

       //cercle extérieur 
       //commence à fonction tout en haut et part du sens anti-trigo
       [f[0],[p[1],co[0],sop[0]]],
       [co[0],[f[0],g[0]]],
       [g[0],[co[0],e[0]]],
       [e[0],[g[0],i[0]]],
       [i[0],[e[0],g[2],ca[0]]],
       [ca[0],[i[0],f[1]]],
       [f[1],[ca[0],p[0]]],
       [p[0],[f[1],cl[1]]],
       [cl[1],[p[0],e[1],t[0]]],
       [t[0],[cl[1],i[1]]],
       [i[1],[t[0],l[2]]],
       [l[2],[i[1],ca[2]]],
       [ca[2],[l[2],co[2],n[1]]],
       [n[1],[ca[2],g[4]]],
       [g[4],[n[1],e[3]]],
       [e[3],[g[4],p[4]]],
       [p[4],[e[3],i[3],sop[3]]],
       [sop[3],[p[4],l[5]]],
       [l[5],[sop[3],co[5]]],
       [co[5],[l[5],g[5]]],
       [g[5],[co[5],t[3],cl[5]]],
       [cl[5],[g[5],f[5]]],
       [f[5],[cl[5],ca[5]]],
       [ca[5],[f[5],e[5]]],
       [e[5],[ca[5],l[4],i[5]]],
       [i[5],[e[5],t[5]]],
       [t[5],[i[5],p[5]]],
       [p[5],[t[5],n[5]]],
       [n[5],[p[5],sop[4],sop[5]]],
       [sop[5],[n[5],cl[4]]],
       [cl[4],[sop[5],i[4]]],
       [i[4],[cl[4],t[4]]],
       [t[4],[i[4],n[4],f[4]]],
       [f[4],[t[4],e[4]]],
       [e[4],[f[4],n[3]]],
       [n[3],[e[4],l[3]]],
       [l[3],[n[3],cl[2],co[3]]],
       [co[3],[l[3],ca[3]]],
       [ca[3],[co[3],n[0]]],
       [n[0], [ca[3],sop[1]]],
       [sop[1], [n[0],f[2],t[1]]],
       [t[1],[sop[1],p[2]]],
       [p[2],[t[1],g[1]]],
       [g[1],[p[2],co[1]]],
       [co[1],[g[1],ca[1],cl[0]]],
       [cl[0],[co[1],l[0]]],
       [l[0],[cl[0],sop[0]]],
       [sop[0],[l[0],f[0]]],

        //2eme liaison (sens anti-trigo)
       [g[2],[i[0],l[1]]],
       [l[1],[g[2],centre]],

       //3eme liaison
       [e[1],[cl[1],sop[2]]],
       [sop[2], [e[1],centre]],

       //4eme liaison
       [co[2],[n[2],ca[2]]],
       [ca[2],[co[2],centre]],

       //5eme
       [i[3],[p[4],cl[3]]],
       [cl[3],[i[3],centre]],

       //6eme
       [t[3],[g[5],f[3]]],
       [f[3],[t[3],centre]],

       //7
       [l[4],[e[5],co[4]]],
       [co[4],[l[4],centre]],

       //8
       [sop[4],[n[4],ca[4]]],
       [ca[4],[sop[4],centre]],

       //9
       [n[4],[t[4],p[3]]],
       [p[3],[n[4],centre]],

       //10
       [cl[2],[l[3],g[3]]],
       [g[3],[cl[2],centre]],

       //11
       [f[2],[sop[1],e[2]]],
       [e[2],[f[2],centre]],

       //12
       [ca[1],[co[1],i[2]]],
       [i[2],[ca[1],centre]]
]);


centre = new Tile(Category.Centre);
let tra = new Tile(Category.Transformation);
let comm = new Tile(Category.Communiquer);
let pro = new Tile(Category.Proportionnalite);
let es = new Tile(Category.Espace);
let no = new Tile(Category.Nombres);
let inf = new Tile(Category.Informatique);
let callit = new Tile(Category.CalculLitteral);
let geo = new Tile(Category.Geometrie);
let cal = new Tile(Category.Calculs);
let log = new Tile(Category.Logique);
let stat = new Tile(Category.StatOuProbas);
let fct = new Tile(Category.Fonctions);


const boardDebug = new Map<Tile,Array<Tile>>([
    [centre,[tra]],
    [tra,[centre,comm]],
    [comm,[tra,pro]],
    [pro,[comm,es]],
    [es,[pro,no]],
    [inf,[es,callit]],
    [callit,[inf,geo]],
    [geo,[callit,cal]],
    [cal,[geo,log]],
    [log,[cal,stat]],
    [stat,[log,fct]],
    [fct,[log]],
]);


export {board1 as classic, boardDebug as debug} ;