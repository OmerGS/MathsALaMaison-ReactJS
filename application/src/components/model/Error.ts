class HotJoinError extends Error{
    constructor(message? : string,option? : ErrorOptions) {
        super(message,option);
        this.name = "HotJoinError";
    }
}


class NoGameInProgressError extends Error{
    constructor(message? : string,option? : ErrorOptions){
        super(message,option);
        this.name = "NoGameInProgressError";
    }
}


class GameAlreadyInProgressError extends Error{
    constructor(){
        super();
        this.name = "GameAlreadyInProgressError";
    }
}

class OutOfOrderError extends Error{
    constructor(message? : string,option? : ErrorOptions){
        super(message,option);
        this.name = "OutOfOrderError";
    }
}

class LoadingError extends Error{
    constructor(message? : string,option? : ErrorOptions){
        super(message,option);
        this.name = "LoadingError";
    }
}

class NoPlayerError extends Error{
    constructor(message? : string,option? : ErrorOptions){
        super(message,option);
        this.name = "NoPlayerError";
    }
}