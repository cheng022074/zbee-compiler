const {
    simpleObject:is_simpleObject
} = require('./is') ;

exports.format = data =>{

    if(is_simpleObject(data)){

        try{

            return JSON.stringify(data , null , 2) ;

        }catch(err){


        }
    }

    return data ;
}