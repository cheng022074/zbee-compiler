const {
    BinCode
} = require('../code'),
{
    run
} = require('../runner'),
compile = require('./compile'),
{
    fork
} = require('child_process');

module.exports = async (name) =>{

    if(!name){

        console.info('请指定调试名称') ;

        return ;
    }

    name = `debug::${name}` ;

    if(compile(name)){

        global.fork = doFork ;

        run(BinCode.get(name).target) ;
    
    }
}

function doFork(name){

    return fork(process.argv[1] , [
        'debug',
        name
    ]) ;
}