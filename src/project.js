const {
    APPLICATION:APPLICATION_PATH,
    COMPILER:COMPILER_PATH,
    fileNormalize,
    extname,
    toName
} = require('./path'),
{
    join,
    relative
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
    file:is_file,
    array:is_array
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
            path = join(binPath , 'header.js'),
            time = readTextFile(path.replace(/\.js$/ , '')) ;

            if(time){
        
                time = Number(time) ;
            
            }else{

                time = -1 ;
            }

        let updateTime = getMotifyTime(join(APPLICATION_PATH , 'properties.json'));
   
        if(updateTime !== time){

            let {
                paths:libPaths
            } = me.libraries,
            len = libPaths.length,
            paths = [];

            for(let i = 0 ; i < len ; i ++){

                paths.push(relative(binPath , libPaths[i]).replace(/\\/g , '/')) ;
            }

            writeTextFile(path , apply('code.bin' , {
                defaultFolder:me.defaultFolder,
                libraries:paths
            })) ;

            writeTextFile(join(binPath , 'header') , updateTime) ;
        }

        let {
            env
        } = process ;

        env['ZBEE-APPLICATION-ROOT-PATH'] = me.rootPath ;

        env['ZBEE-APPLICATION-CONFIG-PATH'] = me.getFolderPath('config') ;

        require(path) ;

        me.init = () =>{

        } ;
    }

    isBinPath(path){

        return path.indexOf(this.getFolderPath('bin')) === 0 ;
    }

    get installNameList(){

        return get(this.properties , 'installs') || [] ;
    }

    get testTimeout(){

        return get(this.properties , 'test.timeout') || 5000;
    }

    get defaultFolder(){

        return this.properties.defaultFolder || 'src';
    }

    getBinPath(folder , name){

        let path,
            me = this,
            suffixes = me.getFolderBinFileReadSuffixes(folder);

        if(suffixes !== false){

            if(is_array(suffixes)){

                for(let suffix of suffixes){

                    path = join(me.getFolderPath(folder) , toPath(name , suffix)) ;

                    if(is_file(path)){

                        return path;
                    }
                }

            }else{

                path = fileNormalize(join(me.getFolderPath(folder) , toPath(name))) ;

                if(is_file(path)){

                    return path ;
                }
            }
        
        }else{

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

    getFolderBinFileReadSuffixes(folder){

        return get(this.properties , `bin.suffix.${folder}`) || false ;
    }

    getFolderBinFileReadType(folder){

        return get(this.properties , `bin.type.${folder}`) || 'normal' ;
    }

    getFolderPath(folder){

        let me = this ;

        return join(me.rootPath , me.getFolderName(folder)) ;
    }

    getPath(folder , name , suffixes){

        return super.getPath(this.getFolderName(folder) , name , suffixes) ;
    }

    get allClassNames(){

        let srcPath = this.getFolderPath('src'),
            paths = getAllFilePaths(srcPath),
            names = [];

        for(let path of paths){

            names.push(toName(path , srcPath)) ;
        }

        return names ;
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