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
    getAllFilePaths,
    readTextFile,
    writeTextFile,
    getMotifyTime
} = require('./fs'),
{
    toName,
    extname
} = require('./path'),
{
    defineCacheProperty
} = require('./object');

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

        me.libraries = new Libraries(me , me.properties = load(join(APPLICATION_PATH , 'properties.json'))) ;
    }

    init(){

        const {
            apply
        } = require('./template') ;

        let me = this,
            binPath = me.getFolderPath('bin'),
            path = join(binPath , 'index.js'),
            time = readTextFile(path.replace(/\.js$/ , '')) ;

            if(time){
        
                time = Number(time) ;
            
            }else{

                time = -1 ;
            }

        let updateTime = getMotifyTime(join(APPLICATION_PATH , 'properties.json'));
 
        if(updateTime !== time){

            writeTextFile(path , apply('code.bin' , {
                defaultFolder:me.defaultFolder,
                libraries:me.libraries.paths
            })) ;

            writeTextFile(join(binPath , 'index') , updateTime) ;
        }

        require(path) ;

        me.init = () =>{

        } ;
    }

    isBinPath(path){

        return path.indexOf(this.getFolderPath('bin')) === 0 ;
    }

    get testTimeout(){

        return get(this.properties , 'test.timeout') || 5000;
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

    getFolderBinFileReadType(folder){

        return get(this.properties , `bin.${folder}`) || 'normal' ;
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

    constructor(project , {
        libraries = []
    }){

        let me = this,
            len = libraries.length,
            paths = me.paths = [];

        for(let i = 0 ; i < len ; i ++){

            paths.push(join(project.getFolderPath('lib') , libraries[i])) ;
        }

        defineCacheProperty(me , 'targets') ;
    }

    applyTargets(){

        let libraries = [],
            {
                paths
            } = this;

        for(let path of paths){

            libraries.push(require(path)) ;
        }

        return libraries ;
    }
}

exports.APPLICATION = new Application() ;

class Compiler extends Project{

    constructor(){

        super(COMPILER_PATH) ;
    }
}

exports.COMPILER = new Compiler() ;