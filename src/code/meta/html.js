const Body = require('./body/html'),
{
    readTextFile
} = require('../../fs');

class Meta extends require('../meta')(){

    getImports(){

        return this.body.imports ;
    }

    getParams(){

        return [] ;
    }

    getRawBody(){

        return readTextFile(this.code.path) ;
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