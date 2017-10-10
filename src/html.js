const {
    js_beautify
} = require('js-beautify') ;

exports.format = data =>{

    try{
        
        return js_beautify(data) ;

    }catch(err){
    }

    return data ;
}