const {
    defined:is_defined,
    file:is_file
} = require('../src/is'),
    {
        join:path_join
    } = require('path'),
    {
        name2path
    } = require('../src/path');

module.exports = (name , bootPath = process.cwd()) =>{

    if(!is_defined(name)){

        console.info('未指定类名称') ;

        return false;
    }

    let path = path_join(bootPath , `${name2path(name)}.js`) ;

    if(!is_file(path)){

        console.error(`${name}不是一个可以运行的程序`) ;

        return false;
    }

    try{

        let result = doExecute(target) ;
    
        if(result instanceof Promise){

            result
                  .then(doSuccess)
                  .catch(doFailure) ;
        }else{

            doSuccess(result) ;
        }

    }catch(err){

        doFailure(err) ;
    }

    

    return true ;
}

function doExecute(target){


}

function doSuccess(result){


}

function doFailure(error){


}