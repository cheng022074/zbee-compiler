
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
    defineCacheProperties,
    defineCacheProperty
} = require('./object'),
{
    defaultFolder
} = APPLICATION,
{
    readTextFile
} = require('./fs'),
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

    get exists(){

        return !!this.path ;
    }
}

class BinCode extends Code{

    static get(name){

       return Code.get('BIN' , this , name) ;
    }

    constructor(fullName){

        super(fullName) ;

        defineCacheProperty(this , 'targets') ;
    }

    applyPath(){

        let {
            name,
            folder
        } = this;

        let path = APPLICATION.getBinPath(folder , name) ;

        if(path === false){

            path = COMPILER.getPath(folder , name) ;
        }

        return path ;

    }

    applyTarget(){

        let {
            folder,
            path,
            fullName
        } = this;
  
        if(path){

            if(folder === 'template'){

                return readTextFile(path) ;
            }

            return require(path) ;

        }
        
        return APPLICATION.libraries.get(fullName) ;
    }

    applyTargets(){

        let {
            folder,
            path,
            fullName
        } = this,
        targets = [];
  
        if(path){

            if(folder === 'template'){

                targets.push(readTextFile(path)) ;
            
            }else{

                targets.push(require(path)) ;
            }
        }

        let target = APPLICATION.libraries.get(fullName) ;

        if(target){

            targets.push(target) ;
        }

        return targets ;
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
baseNameRe = /[^\.]+$/;

class SourceCode extends Code{

    constructor(fullName){

        super(fullName) ;
        
        defineCacheProperty(this , 'baseName') ;
    }

    applyBaseName(){

        return this.name.match(baseNameRe)[0] ;
    }

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

            let config = config_get('code.source' , `${folder}.${extname(path)}`) ;

            if(config){

                let {
                    converter
                } = config ;

                if(converter){

                    return run(BinCode.get(converter).target , me) ;
                }
            }
        }
    }
}

exports.SourceCode = SourceCode ;