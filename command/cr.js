const compile = require('./c'),
      run = require('./r');

module.exports = (name , ...args) =>{

    if(compile(name)){

        run(name , ...args) ;
    }
}