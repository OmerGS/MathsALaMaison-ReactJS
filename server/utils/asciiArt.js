import figlet from 'figlet';

export function displayAsciiArt(){
    figlet('MathsALaMaison', (err, data) => {
        if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
        }
        console.log(data);
    });
}

export function personalizedDisplayAsciiArt(string){
  figlet(string, (err, data) => {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);
  });
}
