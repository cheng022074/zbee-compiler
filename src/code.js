
const {
    APPLICATION,
    COMPILER
} = require('./project'),
{
    resolve
} = require('path'),
{
    toPath,
    parse,
    normalize
} = require('./name'),
{
    defineCacheProperties
} = require('./object'),
{
    defaultFolder
} = APPLICATION,
CODES = {
    BIN:{},
    SOURCE:{}
};

class Code{

    static get(type , classRef , name){

        name = normalize(name , defaultFolder) ;

        let codes = CODES[type] ;

        if(!codes.hasOwnProperty(name)){

            codes[name] = new classRef(name) ;
        }

        return codes[name] ;
    }

    constructor(fullName){

        let me = this,
            {
                folder,
                name
            } = parse(me.fullName = fullName) ;

        me.folder = folder,
        me.name = name ;

        defineCacheProperties(me , [
            'path',
            'target'
        ]) ;
    }
}

class BinCode extends Code{

    static get(name){

       return Code.get('BIN' , this , name) ;
    }

    applyPath(){

        let {
            name,
            folder
        } = this;

        let path = APPLICATION.getBinPath(folder , name) ;

        if(path === false){

            path = COMPILER.getPath(folder , name , [
                '.js',
                '.json'
            ]) ;
        }

        return path ;

    }

    applyTarget(){

        let {
            path,
            fullName
        } = this;
  
        if(path){

            return require(path) ;

        }
        
        return APPLICATION.libraries.get(fullName) ;
    }
}

exports.BinCode = BinCode ;

const {
    keys:config_keys,
    get:config_get,
} = require('./config'),
{
    extname
} = require('./path'),
{
    run
} = require('./runner'),
{
    readTextFile
} = require('./fs');

class SourceCode extends Code{

    static get(name){

        return Code.get('SOURCE' , this , name) ;
    }

    applyPath(){

        let {
            name,
            folder
        } = this;

        let suffixes = config_keys('code.source' , folder) ;

        if(suffixes.length === 0){

            return false ;
        }

        let path = APPLICATION.getPath(folder , name , suffixes) ;

        if(path === false){

            path = COMPILER.getPath(folder , name , suffixes) ;
        }

        return path ;
    }

    applyTarget(){

        let me = this,
        {
            folder,
            path
        } = me;
  
        if(path){

            let name = config_get('code.source' , `${folder}.${extname(path)}`) ;

            if(name){

                return run(BinCode.get(name).target , readTextFile(path) , me) ;
            }
        }
    }
}

exports.SourceCode = SourceCode ;