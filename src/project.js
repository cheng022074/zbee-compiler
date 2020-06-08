const {
    APPLICATION:APPLICATION_PATH,
    COMPILER:COMPILER_PATH,
    fileNormalize
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
    defineProperty,
    defineProperties
} = require('./object'),
{
    toPath
} = require('./name'),
{
    file:is_file,
    array:is_array
} = require('./is'),
{
    readTextFile,
    writeTextFile,
    writeJSONFile,
    getMotifyTime
} = require('./fs'),
{
    load:xml_load,
    selectNodes,
    CDATAValues
} = require('./xml'),
{
    fromPropertyValue:toObject
} = require('./object'),
{
    fromPropertyValue:toArray
} = require('./array'),
{
    env
} = process,
{
    assignIf
} = require('./object');

class Project{

    constructor(path){

        let me = this ;

        me.rootPath = path ;

        defineProperty(me , 'nodeModulesPath') ;
    }

    getNodeModulesPath(){

        let {
            rootPath
        } = this ;

        return join(rootPath , 'node_modules') ;
    }

    getPath(folder , name , suffixes){

        let {
            rootPath
        } = this ;

        if(!suffixes){

            return fileNormalize(join(rootPath , folder , toPath(name))) ;

        }

        let envName = env['ZBEE-ENV'] ;

        for(let suffix of suffixes){

            let path ;

            if(envName){

                path = join(rootPath , folder , toPath(name , `.${envName}${suffix}`)) ;

                if(is_file(path)){

                    return path ;
                }
            }

            path = join(rootPath , folder , toPath(name , suffix)) ;

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

        me.package = load(me.packagePath) || {
            private:true
        };

        defineProperties(me , [
            'dependentModules',
            'dependentModuleNames',
            'moduleName'
        ]) ;

        me.libraries = new Libraries(me , me.properties = load(me.propertiesPath)) ;
    }

    get packagePath(){

        return join(APPLICATION_PATH , 'package.json') ;
    }

    get propertiesPath(){

        return join(APPLICATION_PATH , 'properties.json') ;
    }

    savePackage(){

        let {
            packagePath,
            package:data
        } = this ;

        writeJSONFile(packagePath , data) ;
    }

    addDependencies(dependencies){

        let {
            package:data
        } = this ;

        data.dependencies = assignIf(data.dependencies , dependencies) ;

    }

    addDevDependencies(dependencies){

        let {
            package:data
        } = this ;

        data.devDependencies = assignIf(data.devDependencies , dependencies) ;
    }

    addLibrary(path){

        let {
            properties
        } = this,
        {
            libraries = []
        } = properties ;

        libraries.push(path) ;

        properties.libraries = libraries ;
    }

    saveProperties(){

        let {
            propertiesPath,
            properties:data
        } = this ;

        writeJSONFile(propertiesPath , data) ;
    }

    get version(){

        return this.package.version ;
    }
    
    getDependentModuleNames(){

        return Object.keys(this.dependentModules) ;
    }

    getDependentModules(){

        let {
            dependencies = {},
            devDependencies = {}
        } = this.package ;

        return Object.freeze({
            ...dependencies,
            ...devDependencies
        }) ;
    }

    getModuleName(){

        let {
            name
        } = this.package ;

        return name ;
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

        if(updateTime === -1 || updateTime !== time){

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

        require(path) ;

        me.init = () =>{

        } ;
    }

    isBinPath(path){

        return path.indexOf(this.getFolderPath('bin')) === 0 ;
    }

    get defaultFolder(){

        return this.properties.defaultFolder || 'src';
    }

    getBinPath(folder , name){

        let path,
            me = this,
            suffixes = me.getFolderBinFileReadSuffixes(folder),
            envName = env['ZBEE-ENV'];

        if(suffixes !== false){

            let folderPath = me.getFolderPath(folder) ;

            if(is_array(suffixes)){

                for(let suffix of suffixes){

                    if(envName){

                        path = join(folderPath , toPath(name , `.${envName}${suffix}`)) ;

                        if(is_file(path)){

                            return path ;
                        }
                    }

                    path = join(folderPath , toPath(name , suffix)) ;

                    if(is_file(path)){

                        return path;
                    }
                }

            }else{

                return fileNormalize(join(folderPath , toPath(name))) ;

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

        let suffix = '.js' ;

        if(folder === 'css'){

            suffix = '.scss' ;

            name = `_${name}` ;
        }

        return join(this.getFolderPath('bin') , folder , `${name}${suffix}`) ;
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
}

class Libraries{

    constructor(project , {
        libraries = []
    }){

        let me = this,
            paths = me.paths = [];

        me.project = project ;

        let {
            rootPath
        } = project ;

        for(let path of libraries){

            paths.push(join(rootPath , 'node_modules' , path)) ;
        }

        defineProperties(me , [
            'targets',
            'metas',
            'codeMap',
            'codeNames'
        ]) ;
    }

    getTargets(){

        let libraries = [],
            me = this,
            {
                paths
            } = me;

        for(let path of paths){

            if(is_file(join(path , 'index.js'))){

                libraries.push(require(path)) ;

            }
        }

        return libraries ;
    }

    getMetas(){

        let metas = [],
            me = this,
            {
                paths
            } = me;

        for(let path of paths){

            try{

                metas.push(xml_load(join(path , 'index.xml'))) ;

            }catch(err){

                throw new Error(`无法获取类库元文件 ${path}`) ;
            }
        }

        return metas ;
    }

    getCodeNames(){

        return Object.keys(this.codeMap) ;
    }

    getCodeMap(){

        let {
            metas
        } = this,
        map = {};

        for(let meta of metas){

            let nodes = selectNodes(meta , '//class') ;

            for(let node of nodes){

                map[node.getAttribute('name')] = {
                    motifyTime:Number(node.getAttribute('motify')),
                    signature:node.getAttribute('signature'),
                    data:CDATAValues(node).join(''),
                    importNames:node.hasAttribute('imports') ? toArray(node.getAttribute('imports')) : [],
                    entryTypes:node.hasAttribute('entry-types') ? toArray(node.getAttribute('entry-types')) : [],
                    dependentModules:node.hasAttribute('dependent-modules') ? toObject(node.getAttribute('dependent-modules')) : [],
                    isStandard:node.getAttribute('standard') === 'yes'
                } ;
            }
        }

        return map ;
    }
}

exports.APPLICATION = new Application() ;

class Compiler extends Project{

    constructor(){

        super(COMPILER_PATH) ;
    }
}

exports.COMPILER = new Compiler() ;