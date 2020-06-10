const Body = require('../../../lib/code/source/meta/body/scss'),
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

    getDependentClassSuffix(name){

        return '.scss' ;
    }

    getBody(){

        return new Body(this , this.params) ;
    }

    toString(){

        return `() => \`${this.body.toString()}\`` ;
    }
}

module.exports = code =>{

    return new Meta(code) ;
}