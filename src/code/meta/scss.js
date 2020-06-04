const Body = require('./body/scss') ;

class Meta extends require('../meta')(){

    getImports(){

        return [] ;
    }

    getParams(){

        return [] ;
    }

    getDependentClassSuffix(name){

        return '.scss' ;
    }

    getBody(){

        return new Body(this) ;
    }
}

module.exports = code =>{

    return new Meta(code) ;
}