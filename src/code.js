
const {
    APPLICATION,
    COMPILER
} = require('./project'),
{
    resolve
} = require('path'),
{
    toPath
} = require('./name'),
{
    defineCacheProperties
} = require('./object');

class BinCode{

    static get(name){


    }

    constructor(name){

        let me = this ;

        me.$name = name ;

        defineCacheProperties(me , [
            'folder',
            'name',
            'fullName',
            'target',
            'targets'
        ]) ;
    }

    applyFullName(){


    }

    applyName(){


    }

    applyFolder(){


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