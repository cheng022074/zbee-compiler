const {
    APPLICATION:APPLICATION_PATH,
    COMPILER:COMPILER_PATH,
    fileNormalize
} = require('./path'),
{
    join
} = require('path'),
{
    load
} = require('./json'),
{
    get,
    defineCacheProperties
} = require('./object'),
{
    toPath
} = require('./name'),
{
    file:is_file
} = require('./is'),
{
    from
} = require('./array'),
{
    getAllFilePaths
} = require('./fs'),
{
    toName,
    extname
} = require('./path');

class Project{

    constructor(path){

        this.rootPath = path ;
    }

    getPath(folder , name , suffixes){

        suffixes = from(suffixes) ;

        let {
            rootPath
        } = this ;

        if(suffixes.length === 0){

            return fileNormalize(join(rootPath , folder , toPath(name))) ;
        }

        for(let suffix of suffixes){

            let path = join(rootPath , folder , toPath(name , suffix)) ;

            if(is_file(path)){

                return path ;
            }
        }

        return false ;
    }
}

class Application extends Project{

    constructor(){

        super(APPLICATION_PATH) ;

        let me = this ;

        me.libraries = new Libraries(me.properties = load(join(APPLICATION_PATH , 'properties'))) ;
    }

    get defaultFolder(){

        return this.properties.defaultFolder || 'src';
    }

    getBinPath(folder , name){

        let path,
            me = this;

        switch(folder){

            case 'config':

                path = join(me.getFolderPath('config') , toPath(name , '.json')) ;

                break ;

            case 'template':

                path = fileNormalize(join(me.getFolderPath('template') , toPath(name))) ;

                break ;

            default:

                path = me.generateBinPath(folder , name) ;
        }

        if(is_file(path)){

            return path ;
        }

        return false ;
    }

    generateBinPath(folder , name){

        return join(this.getFolderPath('bin') , folder , `${name}.js`) ;
    }

    getFolderName(folder){

        return get(this.properties , `folders.${folder}`) || folder ;
    }

    getFolderPath(folder){

        let me = this ;

        return join(me.rootPath , me.getFolderName(folder)) ;
    }

    getPath(folder , name , suffixes){

        return super.getPath(this.getFolderName(folder) , name , suffixes) ;
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

class Compiler extends Project{

    constructor(){

        super(COMPILER_PATH) ;
    }
}

exports.COMPILER = new Compiler() ;