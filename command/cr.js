const compile = require('./c'),
      run = require('./r');

module.exports = (name , bootPath) =>{

    if(compile(name , bootPath)){

        run(name , bootPath) ;
    }
}