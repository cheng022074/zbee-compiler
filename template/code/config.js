(name , key) =>{

    const {
        env
    } = process,
    {
        join
    } = require('path');

    let target ;

    if(env.hasOwnProperty('ZBEE-APP-BIN-PATH')){

        try{

            target = require(join(env['ZBEE-APP-BIN-PATH'] , 'config' , `${name}.js`)) ;

        }catch(err){


        }
    }

    if(!target){

        target = include(`config::${name}`) ;
    }

    if(!target){

        return ;
    }

    if(key){

        return include('object.get')(target , key) ;
    }

    return target ; 
}