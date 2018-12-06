
const {
    APPLICATION,
    COMPILER
} = require('./project'),
{
    unique,
    from,
    removeAll
} = require('./array'),
{
    parse,
    normalize
} = require('./name'),
{
    defineCacheProperties,
    defineCacheProperty,
    clearCacheProperties
} = require('./object'),
{
    defaultFolder
} = APPLICATION,
{
    remove,
    readTextFile,
} = require('./fs'),
{
    load
} = require('./json'),
{
    include
} = require('./script'),
{
    watch
} = require('chokidar'),
{
    toName
} = require('./path'),
{
    empty:isEmpty
} = require('./is'),
CODES = {
    BIN:{},
    SOURCE:{}
},
{
    env
} = process;

class Code{

    static get(type , classRef , name){

        if(!isEmpty(name)){

            name = normalize(name , defaultFolder) ;

            let codes = CODES[type] ;
    
            if(!codes.hasOwnProperty(name)){
    
                codes[name] = new classRef(name) ;
                
            }
    
            return codes[name] ;   
        }

        throw new Error('应使用名称定位代码') ;
    }

    static remove(type , name){

        delete CODES[type][name] ;
        
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
            'path',
            'target'
        ]) ;
    }

    reset(){

        clearCacheProperties(this , [
            'path',
            'target'
        ]) ;
    }

    destroy(){

        this.reset() ;
    }

    get exists(){

        return !!this.path ;
    }
}

class BinCode extends Code{

    static get(name){

       return Code.get('BIN' , this , name) ;
    }

    constructor(fullName){

        super(fullName) ;

        defineCacheProperty(this , 'targets') ;
    }

    reset(){

        super.reset() ;

        clearCacheProperties(this , 'targets') ;
    }
    
    destroy(){

        super.destroy() ;

        let 
        me = this,
        {
            name,
            folder
        } = me;

        remove(APPLICATION.generateBinPath(folder , name)) ;

        Code.remove('BIN' , me.name) ;
    }

    applyPath(){

        let 
        me = this,
        {
            name,
            folder
        } = me;

        let path = APPLICATION.getBinPath(folder , name) ;

        if(path === false){

            path = me.compilerPath ;
        }

        return path ;

    }

    get compilerPath(){

        let {
            name,
            folder
        } = this ;

        return COMPILER.getPath(folder , name) ;
    }

    applyTarget(){

        let {
            folder,
            path,
            fullName
        } = this;

        if(path){

            return get_target(folder , path) ;

        }

        return get_library_item(fullName) ;
    }

    applyTargets(){

        let 
        me = this,
        {
            folder,
            path,
            fullName
        } = me,
        targets = [];


        if(path){

            targets.push(get_target(folder , path)) ;
        }

        let item = get_library_item(fullName) ;

        if(item){

            targets.push(item) ;
        }

        let {
            compilerPath
        } = me ;

        if(compilerPath && compilerPath !== path){

            targets.push(get_target(folder , compilerPath)) ;
        }

        return targets ;
    }
}

function get_library_item(fullName){

    let targets = APPLICATION.libraries.targets ;

    for(let target of targets){

        if(target.hasOwnProperty(fullName)){

            return target[fullName] ;
        }
    }
}

function get_target(folder , path){

    if(APPLICATION.isBinPath(path)){

        return include(path) ;
    }

    switch(APPLICATION.getFolderBinFileReadType(folder)){

        case 'text':

            return readTextFile(path) ;

        case 'json':

            return load(path) ;

        case 'normal':

            return include(path) ;
    }
}

exports.BinCode = BinCode ;

const {
    keys:config_keys,
    get:config_get,
} = require('./config'),
{
    extname
} = require('./path'),
{
    runAsync:run
} = require('./runner'),
baseNameRe = /[^\.]+$/,
Meta = require('./code/meta');

class SourceCode extends Code{

    static watch(folders , callback , scope){

        folders = from(folders) ;

        const {
            onWatchEvent
        } = this ;
        
        for(let folder of folders){

            let folderPath = APPLICATION.getFolderPath(folder) ;

            watch(folderPath)
            .on('change' , path => onWatchEvent(folder , folderPath , path , 'changed' , callback , scope))
            .on('unlink' , path => onWatchEvent(folder , folderPath , path , 'removed' , callback , scope));
        }
    }

    static onWatchEvent(folder , folderPath , path , state , callback , scope){

        let name = `${folder}::${toName(path , folderPath)}`,
            {
                SOURCE,
                BIN
            } = CODES;

        if(SOURCE.hasOwnProperty(name)){

            SOURCE[name].reset() ;
        }

        if(state === 'removed'){

            BinCode.get(name).destroy();
        
        }else{

            if(BIN.hasOwnProperty(name)){

                BIN[name].reset() ;
            }

            require('./command/compile')(name) ;
        }

        callback.call(scope , state , name) ;
    }

    get project(){

        return APPLICATION ;
    }

    constructor(fullName){

        super(fullName) ;
        
        defineCacheProperties(this , [
            'baseName',
            'importSourceCodes',
            'importNames',
            'packageCodeText',
            'binCodeText',
            'aliases',
            'config',
            'isScript',
            'meta'
        ]) ;
    }

    get signature(){

        let {
            fullName,
            meta
        } = this ;

        return `function ${fullName}(${meta.paramFullNames.join(',')});` ;
    }

    applyMeta(){

        return new Meta(this) ;
    }

    reset(){

        super.reset() ;

        clearCacheProperties(this ,  [
            'baseName',
            'importSourceCodes',
            'importNames',
            'packageCodeText',
            'binCodeText',
            'aliases',
            'config',
            'isScript',
            'meta'
        ]) ;
    }
    
    destroy(){

        super.destroy() ;

        let {
            exists,
            path,
            name
        } = this ;

        if(exists){

            remove(path) ;
        }

        Code.remove('SOURCE' , name) ;
    }

    applyBinCodeText(){

        let {
            target
        } = this ;

        if(target){

            return target.binCodeText ;
        }

        return '' ;
    }

    applyPackageCodeText(){

        let {
            target
        } = this ;

        if(target){

            return target.packageCodeText ;
        }

        return '' ;
    }

    applyAliases(){

        let {
            target
        } = this ;

        if(target){

            return target.aliases ;
        }

        return [] ;
    }

    applyBaseName(){

        return this.name.match(baseNameRe)[0] ;
    }

    static get(name){

        return Code.get('SOURCE' , this , name) ;
    }

    applyPath(){

        let {
            name,
            folder
        } = this;

        let suffixes = config_keys('code.source' , folder) ;

        if(suffixes.length === 0){

            return false ;
        }

        let path = APPLICATION.getPath(folder , name , suffixes) ;

        if(path === false){

            path = COMPILER.getPath(folder , name , suffixes) ;
        }

        return path ;
    }

    get importAllSourceCodes(){

        let code = this,
            codes = [
                code
            ];

        get_import_source_codes(code , codes) ;

        codes.pop();

        return codes ;

    }

    applyImportNames(){

        let {
            target
        } = this ;

        if(target){

            let {
                importNames
            } = target.meta ;

            if(importNames){

                return importNames ;
            }
        }

        return [] ;
    }

    get importAllNames(){

        let {
            importAllSourceCodes
        } = this,
        names = [];

        for(let code of importAllSourceCodes){

            names.push(code.fullName , ...code.importNames) ;
        }

        return unique(names) ;
    }

    applyImportSourceCodes(){

        let names = this.importNames,
            codes = [];

        for(let name of names){

            let code = SourceCode.get(name) ;

            if(code){

                codes.push(code) ;
            }
        }

        return codes ;
    }

    applyConfig(){

        let me = this,
        {
            folder,
            path
        } = me,
        envName = env['ZBEE-ENV'];

        if(path){

            let suffix = extname(path),
                config = config_get('code.source' , `${folder}.${suffix}`) ;

            if(!config && envName){

                let envSuffix = `.${envName}` ;

                if(suffix.indexOf(`${envSuffix}.`) === 0){

                    config = config_get('code.source' , `${folder}.${suffix.replace(envSuffix , '')}`) ;
                }
            }

            return config ;
        }
    }

    applyIsScript(){

        let {
            config
        } = this ;

        if(config){

            return config.script !== false ;
        }

        return false ;
    }

    applyTarget(){

        let 
        me = this,
        {
            config
        } = me ;

        if(config){

            let {
                converter
            } = config ;

            if(converter){

                return run(BinCode.get(converter).target , me) ;
            }
        }
    }
}

function get_import_source_codes(code , codes){
    
    let importCodes = code.importSourceCodes ;

    for(let importCode of importCodes){

        if(!codes.includes(importCode)){

            codes.splice(codes.indexOf(code) , 0 , importCode) ;

            get_import_source_codes(importCode , codes) ;
        }
    }
}

exports.SourceCode = SourceCode ;