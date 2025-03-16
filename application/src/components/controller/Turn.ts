import { createMove } from "@/app/(tabs)/test";
import Round from "./Round";



function start(round : Round){
    console.log("start");
    createMove();
}

function move(round : Round){
    console.log("move");
}

export {start, move};