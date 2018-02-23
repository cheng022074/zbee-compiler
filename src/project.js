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
} = require('./is'),
{
    from
} = require('./array');

class Project{

    constructor(path){

        this.rootPath = path ;
    }

    getPath(folder , name , suffixes){

        suffixes = from(suffixes) ;

        let {
            rootPath
        } = this ;

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

        return this.libraries.defaultFolder || 'src';
    }

    getBinPath(folder , name){

        let path ;

        switch(folder){

            case 'config':

                path = join(APPLICATION_PATH , 'config' , toPath(name , '.json')) ;

                break ;

            default:

                path = join(APPLICATION_PATH , 'bin' , folder , `${name}.js`) ;
        }

        if(is_file(path)){

            return path ;
        }

        return false ;
    }

    getPath(folder , name , suffixes){

        return super.getPath(get(this.properties , `folders.${folder}`) || folder , name , suffixes) ;
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