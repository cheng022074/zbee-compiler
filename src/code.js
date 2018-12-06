
const {
    APPLICATION,
    COMPILER
} = require('./project'),
{
    unique,
    from
} = require('./array'),
{
    parse,
    normalize
} = require('./name'),
{
    defineProperties,
    defineProperty,
    resetProperties
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
    toName,
    extname
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

        defineProperties(me , [
            'path',
            'target'
        ]) ;
    }

    reset(){

        resetProperties(this , [
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

        defineProperty(this , 'targets') ;
    }

    reset(){

        super.reset() ;

        resetProperties(this , 'targets') ;
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

    getPath(){

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

    getTarget(){

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

    getTargets(){

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
    runAsync:run
} = require('./runner'),
baseNameRe = /[^\.]+$/;

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
        
        defineProperties(this , [
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
            meta,
            fullName
        } = this,
        {
            signatureReturnTypes,
            paramSignatureNames
        } = meta,
        result = [];

        return `${signatureReturnTypes} ${fullName}(${paramSignatureNames})` ;
    }

    getMeta(){

        let 
        me = this,
        {
            config
        } = me ;

        if(config){

            let {
                meta
            } = config,
            target = run(BinCode.get(meta).target , me) ;

            if(!target){

                return run('code.meta' , me) ;
            }

            return target ;
        }

        return false ;
    }

    reset(){

        super.reset() ;

        resetProperties(this ,  [
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

    getBinCodeText(){

        let {
            target
        } = this ;

        if(target){

            return target.binCodeText ;
        }

        return '' ;
    }

    getPackageCodeText(){

        let {
            target
        } = this ;

        if(target){

            return target.packageCodeText ;
        }

        return '' ;
    }

    getAliases(){

        let {
            target
        } = this ;

        if(target){

            return target.aliases ;
        }

        return [] ;
    }

    getBaseName(){

        return this.name.match(baseNameRe)[0] ;
    }

    static get(name){

        return Code.get('SOURCE' , this , name) ;
    }

    getPath(){

        let {
            name,
            folder
        } = this;

        let suffixes = config_keys('code.source' , folder) ;

        if(suffixes.length === 0){

            return false ;
        }

        return APPLICATION.getPath(folder , name , suffixes) ;
    }

    get suffix(){

        let {
            path
        } = this ;

        if(path){

            return extname(path) ;
        }

        return false ;
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

    getImportNames(){

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

    getImportSourceCodes(){

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

    getConfig(){

        let me = this,
        {
            folder,
            suffix
        } = me,
        envName = env['ZBEE-ENV'];

        if(suffix){

            let config = config_get('code.source' , `${folder}.${suffix}`) ;

            if(!config && envName){

                let envSuffix = `.${envName}` ;

                if(suffix.indexOf(`${envSuffix}.`) === 0){

                    config = config_get('code.source' , `${folder}.${suffix.replace(envSuffix , '')}`) ;
                }
            }

            return config ;
        }
    }

    getIsScript(){

        let {
            config
        } = this ;

        if(config){

            return config.script !== false ;
        }

        return false ;
    }

    getTarget(){

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