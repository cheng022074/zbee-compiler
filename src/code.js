
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
BIN_CODES = {};

class BinCode{

    static get(name){

        name = normalize(name) ;

        if(!BIN_CODES.hasOwnProperty(name)){

            BIN_CODES[name] = new BinCode(name) ;
        }

        return BIN_CODES[name] ;
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
            'target',
            'targets'
        ]) ;
    }

    applyPath(){

        let {
            name,
            folder
        } = this;

        let path = APPLICATION.getPath(folder , name) ;

        if(path === false){

            path = COMPILER.getPath(folder , name) ;
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

    applyTargets(){

        let {
            path,
            fullName
        } = this,
        targets = [];

        if(path){

            targets.push(require(path)) ;
        }

        targets.push(...APPLICATION.libraries.getAll(fullName)) ;
    }
}

exports.BinCode = BinCode ;