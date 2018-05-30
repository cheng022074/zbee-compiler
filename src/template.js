const {
    BinCode
} = require('./code'),
{
    compile
} = require('ejs'),
TEMPLATES = {};

function apply(name , data = {}){

    if(!TEMPLATES.hasOwnProperty(name)){

        let template = BinCode.get(`template::${name}`) ;

        if(template.exists){

            TEMPLATES[name] = compile(template.target) ;
        
        }else{

            TEMPLATES[name] = emptyFn ;
        }
    }

    return TEMPLATES[name]({
        data,
        apply
    }) ;

}

exports.apply = apply ;

function emptyFn(){

    return '' ;
}