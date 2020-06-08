const Body = require('./body/scss'),
{
    readTextFile,
    writeTextFile
} = require('../../fs'),
{
    join
} = require('path'),
{
    toBinSCSSFileName,
    toBinCSSFileName
} = require('../../name'),
{
    renderSync
} = require('node-sass');

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

        return new Body(this) ;
    }

    toString(){

        return this.body.toString() ;
    }

    get binPath(){

        let {
            project,
            folder,
            name
        } = this.code ;

        return join(project.getFolderPath('bin') , folder , toBinSCSSFileName(name)) ;
    }

    get binData(){

        let {
            data
        } = this.code ;

        return data ;
    }

    afterCompile(){

        let {
            code,
            binPath
        } = this,{
            folder,
            name,
            project
        } = this.code ;

        writeTextFile(join(project.getFolderPath('bin') , folder , toBinCSSFileName(name)) , renderSync({
            file:binPath
        }).css.toString('utf8')) ;
    }
}

module.exports = code =>{

    return new Meta(code) ;
}