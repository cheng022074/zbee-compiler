const compile = require('./compile'),
      run = require('./run');

module.exports = (name , ...args) =>{

    if(compile(name)){

        run(name , ...args) ;
    }
}