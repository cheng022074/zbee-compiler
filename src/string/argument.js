const {
    type:convert
} = require('./convert') ;

exports.parse = (args , types) =>{

    let len = args.length,
        result = [];

    for(let i = 0 ; i < len ; i ++){

        let type = types[i],
            arg = args[i];

        if(type){

            result.push(convert(arg , type)) ;
        }else{

            result.push(arg) ;
        }
    }

    return result ;
}