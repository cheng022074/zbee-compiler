const {
    js
} = require('js-beautify') ;

exports.format = code =>{

    try{

        return js(code) ;

    }catch(err){


    }

    return code ;
}