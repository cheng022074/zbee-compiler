const {
    APPLICATION:APPLICATION_PATH,
    COMPILER:COMPILER_PATH,
    fileNormalize,
    toName
} = require('./path'),
{
    join,
    relative,
    dirname
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
    from,
    unique
} = require('./array'),
{
    getAllFilePaths,
    readTextFile,
    writeTextFile,
    getMotifyTime
} = require('./fs'),
{
    load:xml_load,
    selectNodes,
    CDATAValues
} = require('./xml'),
{
    split
} = require('./string'),
sepRe = /\\|\//,
{
    env
} = process ;

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

        me.package = load(join(APPLICATION_PATH , 'package.json')) ;

        defineProperties(me , [
            'dependentModules',
            'dependentModuleNames',
            'moduleName'
        ]) ;

        me.libraries = new Libraries(me , me.properties = load(join(APPLICATION_PATH , 'properties.json'))) ;
    }

    getDependentModuleNames(){

        return Object.keys(this.dependentModules) ;
    }

    getDependentModules(){

        let {
            dependencies
        } = this.package ;

        return Object.freeze(dependencies || {}) ;
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

        env['ZBEE-APPLICATION-ROOT-PATH'] = me.rootPath ;

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

        let me = this ;

        return [
            ...get_class_names.call(me , 'config'),
            ...get_class_names.call(me , 'src'),
            ...get_class_names.call(me , 'template')
        ]
    }
}

function get_class_names(folder){

    let srcPath = this.getFolderPath(folder),
        paths = getAllFilePaths(srcPath),
        names = [];

    for(let path of paths){

        let name = toName(path , srcPath) ;

        if(folder !== 'src'){

            name = `${folder}::${name}` ;
        }

        names.push(name) ;
    }

    return unique(names) ;
}

const relativePathRe = /\.{1,2}/ ;

class Libraries{

    constructor(project , {
        libraries = []
    }){

        let me = this,
            paths = me.paths = [];

        me.project = project ;

        let {
            dependentModuleNames,
            rootPath
        } = project ;

        for(let path of libraries){

            let dirpath = dirname(path) ;

            if(dirpath && !relativePathRe.test(dirpath)){

                let [
                    folderName
                ] = split(dirpath , sepRe) ;

            
                if(dependentModuleNames.includes(folderName)){

                    paths.push(join(rootPath , 'node_modules' , path)) ;

                    continue ;
                }
            }

            paths.push(join(project.getFolderPath('lib') , path)) ;
        }

        defineProperties(me , [
            'targets',
            'metas',
            'codeMap'
        ]) ;
    }

    getTargets(){

        let libraries = [],
            me = this,
            {
                paths
            } = me;

        for(let path of paths){

            try{

                libraries.push(require(path)) ;

            }catch(err){

                if(err.message.indexOf('Cannot find module') !== -1){

                    throw new Error(`无效的类库路径 ${path}`) ;
                }

                throw err ;
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

    getCodeMap(){

        let {
            metas
        } = this,
        map = {},
        spaceRe = /\s+/;

        for(let meta of metas){

            let nodes = selectNodes(meta , '//class') ;

            for(let node of nodes){

                map[node.getAttribute('name')] = {
                    motifyTime:Number(node.getAttribute('motify')),
                    signature:node.getAttribute('signature'),
                    data:CDATAValues(node).join(''),
                    importNames:node.hasAttribute('imports') ? split(node.getAttribute('imports') , spaceRe) : []
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