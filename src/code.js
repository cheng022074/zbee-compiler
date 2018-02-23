
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
} = require('./object'),;

class BinCode{

    static get(name){


    }

    constructor(name){

        let me = this ;

        me.$name = name ;

        defineCacheProperties(me , [
            'scope',
            'name',
            'fullName'
        ]) ;
    }

    applyFullName(){


    }

    applyName(){


    }

    applyScope(){


    }

    applyPath(){

        let {
            name,
            scope
        } = this;

        let path = APPLICATION.getPath('bin' , name , scope) ;

        if(path === false){

            path = COMPILER.getPath('src' , name , scope) ;
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