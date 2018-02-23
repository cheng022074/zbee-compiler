const {
    APPLICATION:APPLICATION_PATH,
    COMPILER:COMPILER_PATH
} = require('./path'),
{
    join
} = require('path'),
{
    load
} = require('./json'),
{
    get
} = require('./object'),
{
    toPath
} = require('./name'),
{
    file:is_file
} = require('./is');

class Application{

    constructor(){

        let me = this ;

        me.libraries = new Libraries(me.properties = load(join(APPLICATION_PATH , 'properties'))) ;
    }

    get defaultFolder(){

        return this.libraries.defaultFolder || 'src';
    }

    getBinPath(folder , name){

        let path = join(APPLICATION_PATH , 'bin' , folder , `${name}.js`) ;

        if(is_file(path)){

            return path ;
        }

        return false ;
    }

    getPath(folder , name , suffix){

        return join(APPLICATION_PATH , get(this.properties , `folders.${folder}`) || folder , toPath(name , suffix)) ;
    }
}

class Libraries{

    constructor({
        libraries = []
    }){

        let len = libraries.length ;

        for(let i = 0 ; i < len ; i ++){

            libraries[i] = require(join(APPLICATION_PATH , libraries[i])) ;
        }

        this.libraries = libraries ;
    }

    get(name){

        let {
            libraries
        } = this ;

        for(let library of libraries){

            if(library.hasOwnProperty(name)){

                return library[name] ;
            }
        }
    }
}

exports.APPLICATION = new Application() ;

class Compiler{

    getPath(folder , name , suffix){

        return join(COMPILER_PATH , folder , toPath(name , suffix)) ;
    }
}

exports.COMPILER = new Compiler() ;