import Round from "@/components/controller/Round";
import Player from "./Player";
import {arrayToMapWAllSameValue as aTMWASM} from '../util/general-utils';

abstract class Action{

    protected _name = "";
    protected _participants : Array<Player> = [];

    private _round : Round;

    public constructor(r : Round){
        this._round = r;
    }

    /**
     * Called before seeing the question
     */
    abstract before() : void

    /**
     * Called when an answer has been given by the player
     * But before the win lose
     * @param answers a map of Player paired with their answer
     */
    abstract answer() : any

    /**
     * What happen if the current player get the good answer
     * @param this.participants the players who will receive the points
     * @returns an Map Player, points added
     */
    win() : Map<Player,number>{
        return aTMWASM(this.participants,1);
    }
    /**
     * What happen if the current player get the good answer
     * @param this.participants the players who will receive the points
     * @returns an Map Player, points added
     */
    lose() : Map<Player,number>{
        return aTMWASM(this.participants,0);
    }

    public set participants(p : Array<Player>){
        this._participants = [...this.participants];
    }

    public get participants() : Array<Player>{
        return this._participants;
    }

    public get name(): string{
        return this.name;
    }


    /**
     * Set the round where the actions are going to be used
     */
    public set round(r : Round){
        this._round = r;
    }

    public get round() : Round{
        return this._round;
    }

    public toString(){
        return this.constructor.name;
    }

}


class Flash extends Action{
    public _answered = false;
    private _time = 0;
    private _maxTime = 30;

    public before(): void {
        const interval1 = setInterval(() => {
            if (this._answered) {
                clearInterval(interval1);
                console.log("Both counters stopped at:");
                console.log(this._time);
                return;
            }
            this._time++;
            console.log("Counter 1:", this._time);
        }, 1000);
    }
    public answer(){
        this._answered = true;
    }
    public win(): Map<Player, number> {
        if(this._time> this._maxTime){
            //took too much time
            return aTMWASM(this.participants,0);
        }
        else{
            //in time
            return aTMWASM(this.participants,1);
        }
    }

    
    public get participants(){
        if(this.round.currentPlayer == null) throw new NoGameInProgressError("Can't attribute player to action");
        return [this.round.currentPlayer];
    }

    public get name(): string {
        return "Flash";
    }
}

/**
 * Battle with the player who got less point than the current player
 */
class BattleOnLeft extends Action{
    
    public before(): void {
        
    }
    
    public answer() {
        
    }

    public get participants(){
        if(this.round == null) throw new Error("No round in progress");
        if(this.round.currentPlayer == null) throw new Error("No player playing");
        let players = [this.round.playerBefore,this.round.currentPlayer];
        return players;
    }
    public get name(): string {
        return "Battle on Left";
    }
}

/**
 * Battle with the player who got more point than the current player
 */
class BattleOnRight extends Action{
    public before(): void {
        
    }
    public answer() {
        
    }

    public get participants(){
        if(this.round == null) throw new Error("No round in progress");
        if(this.round.currentPlayer == null) throw new Error("No player playing");
        let players = [this.round.playerAfter,this.round.currentPlayer];
        return players;
    }
    public get name(): string {
        return "Battle On Right";
    }
}

//if at least one of the players get the answer both get points
class CallAFriend extends Action{
    public before(){
        //TODO player mush choose another player to answer
    }
    public answer() {
        
    }

    public get participants(){
        if(this.round == null) throw new Error("No round in progress");
        return [];
        //TODO player must choose an other player to search the answer with.
    }
    public get name(): string {
        return "Call a friend";
    }
}


//if the other player doesn't get the answer nobody gain pooints
class ForYou extends Action{
    public before(): void {
        //TODO player mush choose another player to answer
    }
    public answer() {
        
    }

    public get participants(): Array<Player> {
        if(this.round.currentPlayer == null) throw new Error("No round in progress");
        return [this.round.currentPlayer];
    }
    public get name(): string {
        return "For You";
    }
}


class SecondLife extends Action{
    public before(): void {
        
    }
    public answer() {
    }

    public get participants(): Array<Player> {
        if(this.round.currentPlayer == null) throw new NoGameInProgressError("Can't attribute player to action");
        return [this.round.currentPlayer];
    }
    public get name(): string {
        return "SecondLife";
    }
}

class NoWay extends Action{
   public answer() {}
   public before(): void {}
   public win(): Map<Player, number> {
        let result = new Map<Player,number>();
        this.participants.forEach(e => {
            result.set(e,1);
        });
        return result;
   }
   public lose(): Map<Player, number> {
        let result = new Map<Player,number>();
        let ben = this.round.players.filter(l => {
            return l !== this.participants[0]
        });
        return aTMWASM(ben,1);

   }
   public get participants(): Array<Player>{
        if(this.round.currentPlayer == null) throw new NoGameInProgressError("Can't attribute player to action");
        return [this.round.currentPlayer];
   }
    public get name(): string {
        return "NoWay";
    }
}


class Double extends Action{
    public answer() {}
    public before(): void {}
    public win(): Map<Player, number> {
        let result = new Map<Player,number>();
        this.participants.forEach(e  =>{
            result.set(e,2);
        });
        return result;
    }
    public lose(): Map<Player, number> {
        let result = new Map<Player,number>();
        this.participants.forEach(e =>{
            e.points = 0;
            e.pointCategory.forEach(c =>{
                result.set(e,-1);
            });
        });
        return result;
    }

    public get participants() : Array<Player>{
        if(this.round.currentPlayer == null) throw new NoGameInProgressError("Can't attribute player to action");
        return [this.round.currentPlayer];
    }
    public get name(): string {
        return "Double";
    }
}

// aucune idée de comment faire ça
class Teleportation extends Action{
    public before(): void {
        
    }

    public answer() {
        
    }


    public get participants() : Array<Player>{
        if(this.round.currentPlayer == null) throw new NoGameInProgressError("Can't attribute player to action");
        return [this.round.currentPlayer];
    }
    public get name(): string {
        return "Teleportation";
    }
}

class Plus1Moins1 extends Action{
    public answer() {}
    public before(): void {}
    public win(): Map<Player, number> {
        let result = new Map<Player,number>();
        this.participants.forEach(e  =>{
            result.set(e,2);
        });
        return result;
    }
    public lose(): Map<Player, number> {
        let result = new Map<Player,number>();
        this.participants.forEach(e =>{
            e.points = 0;
            e.pointCategory.forEach(c =>{
                result.set(e,-1);
            });
        });
        return result;
    }

    public get participants() : Array<Player>{
        if(this.round.currentPlayer == null) throw new NoGameInProgressError("Can't attribute player to action");
        return [this.round.currentPlayer];
    }
    
    public get name(): string {
        return "+1 -1";
    }
    
}
//TODO add other people
class Everybody extends Action{
    public before(): void {
        
    }
    public answer() {
        
    }
    public get participants() : Array<Player>{
        if(this.round.currentPlayer == null) throw new NoGameInProgressError("Can't attribute player to action");
        return [...this.round.players];
    }
    public get name(): string {
        return "Everybody";
    }
}

class DoubleOrQuit extends Action{
    public answer() {}
    public before(): void {}
    public win(): Map<Player, number> {
        let result = new Map<Player,number>();
        this.participants.forEach(e  =>{
            result.set(e,e.points);
        });
        return result;
    }
    public lose(): Map<Player, number> {
        let result = new Map<Player,number>();
        this.participants.forEach(e =>{
            e.points = 0;
            e.pointCategory.forEach(c =>{
                result.set(e,-e.points);
            });
        });
        return result;
    }
    public get participants() : Array<Player>{
        if(this.round.currentPlayer == null) throw new NoGameInProgressError("Can't attribute player to action");
        return [this.round.currentPlayer];
    }
    public get name(): string {
        return "DoubleOrQuit";
    }
}

//TODO ping pong
// choice between 3 random Action
class ItsYourChoice extends Action{

    public before(): void {}
    public answer() {}

    public get name(): string {
        return "ItsYourChoice";
    }
}

class Quadruple extends Action{

    public answer() {}
    public before(): void {}
    public win(): Map<Player, number> {
        return aTMWASM(this.participants,4);
    }
    
    public get name(): string {
        return "Quadruple";
    }
}

class Empty extends Action{
    before(): void {
        
    }
    answer() {
        
    }
    public get name(){
        return "";
    }
}


export {Action,Flash,BattleOnLeft,BattleOnRight,CallAFriend,ForYou,SecondLife,NoWay,Double,Teleportation,Plus1Moins1,Everybody,DoubleOrQuit,ItsYourChoice,Quadruple,Empty};