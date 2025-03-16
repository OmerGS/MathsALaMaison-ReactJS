const randomInt = (min : number, max : number) => Math.floor(Math.random() * (max - min + 1)) + min;

const arrayToMapWAllSameValue = (array : Array<any>, value : any) => {
    let r = new Map();
    array.forEach(e =>{ 
        r.set(e,value);
    });
    return r;
};



export {randomInt, arrayToMapWAllSameValue} ;