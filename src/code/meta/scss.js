const Body = require('./body/scss'),
{
    readTextFile
} = require('../../fs');

class Meta extends require('../meta')(){

    getImports(){

        return [] ;
    }

    getParams(){

        return [] ;
    }

    getRawBody(){

        return readTextFile(this.code.path) ;
    }

    getDependentClassSuffix(name){

        return '.scss' ;
    }

    getBody(){

        return new Body(this) ;
    }

    toString(){

        return this.body.toString() ;
    }
}

module.exports = code =>{

    return new Meta(code) ;
}