
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
    resetProperties,
    copyTo
} = require('./object'),
{
    defaultFolder
} = APPLICATION,
{
    remove,
    readTextFile,
    getMotifyTime
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
    SOURCE:{},
    LIBRARY_SOURCE:{}
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
    }

    destroy(){

        this.reset() ;
    }

    get path(){

        return false ;
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

        defineProperties(this , [
            'target',
            'targets'
        ]) ;
    }

    reset(){

        resetProperties(this , [
            'target',
            'targets'
        ]) ;
    }
    
    destroy(){

        super.destroy() ;

        let me = this,
        {
            name,
            folder
        } = me;

        remove(APPLICATION.generateBinPath(folder , name)) ;

        Code.remove('BIN' , name) ;
    }

    get path(){

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

    static get(name){

        return Code.get('SOURCE' , this , name) ;

    }

    static getProperty(code , property){

        if(code.exists){

            return code[property] ;
        }

        let libCode = Code.get('LIBRARY_SOURCE' , LibrarySourceCode , code.fullName) ;

        if(libCode.exists){

            return code[property] ;
        }
    }

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
            'meta'
        ]) ;
    }

    get motifyTime(){

        return getMotifyTime(this.path) ;
    }

    get signature(){

        let {
            meta,
            fullName
        } = this,
        {
            signatureReturnTypes,
            paramSignatureNames,
            isAsync
        } = meta;

        return `${isAsync ? 'async ' : ''}${signatureReturnTypes} ${fullName}(${paramSignatureNames})` ;
    }

    getMeta(){

        let 
        me = this,
        {
            config
        } = me ;

        if(config){

            let {
                meta = 'code.meta'
            } = config,
            target = run(BinCode.get(meta).target , me) ;

            if(!target){

                return run(BinCode.get('code.meta').target , me) ;
            }

            return target ;
        }

        return run(BinCode.get('code.meta').target , me) ;
    }

    reset(){

        super.reset() ;

        resetProperties(this ,  'meta') ;
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

    get data(){

        return this.meta.toString() ;
    }

    get binData(){

        let {
            data
        } = this ;

        return `module.exports = ${data};` ;
    }

    get packageData(){

        let {
            data,
            fullName
        } = this ;

        return `exports['${fullName}'] = ${data};` ;
    }

    getBaseName(){

        return this.name.match(baseNameRe)[0] ;
    }

    get path(){

        let {
            name,
            folder
        } = this;

        return APPLICATION.getPath(folder , name , config_keys('code.source' , `${folder}.suffixes`)) ;
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

    get importAllNames(){

        let {
            importAllSourceCodes
        } = this,
        names = [];

        for(let {
            fullName
        } of importAllSourceCodes){

            names.push(fullName) ;
        }

        return names ;
    }

    get importSourceCodes(){

        let names = this.meta.importNames,
            codes = [];

        for(let name of names){

            codes.push(SourceCode.get(name)) ;
        }

        return codes ;
    }

    get config(){

        let me = this,
        {
            folder,
            suffix
        } = me,
        envName = env['ZBEE-ENV'];

        if(suffix){

            let config = config_get('code.source' , `${folder}.suffixes.${suffix}`) ;

            if(!config && envName){

                let envSuffix = `.${envName}` ;

                if(suffix.indexOf(`${envSuffix}.`) === 0){

                    config = config_get('code.source' , `${folder}.suffixes.${suffix.replace(envSuffix , '')}`) ;
                }
            }

            return config ;
        }
    }
}

function get_import_source_codes(code , codes){

    let importCodes = SourceCode.getProperty(code , 'importSourceCodes') || [] ;
    
    for(let importCode of importCodes){

        if(!codes.includes(importCode)){

            codes.splice(codes.indexOf(code) , 0 , importCode) ;

            get_import_source_codes(importCode , codes) ;
        }
    }
}

class LibrarySourceCode extends SourceCode{

    constructor(fullName){

        super(fullName) ;

        let me = this,
        {
            codeMap
        } = me.project.libraries ;

        if(codeMap.hasOwnProperty(fullName)){

            me.$meta = codeMap[fullName] ;

        }else{

            me.$meta = {
                importNames:[]
            } ;
        }
    }

    getMeta(){

        let {
            $meta
        } = this ;

        return copyTo({
            tostring(){

                return $meta.data ;
            }
        } , $meta , [
            'motifyTime',
            'signature',
            'importNames'
        ]) ;
    }

    get motifyTime(){

        return this.$meta.motifyTime ;
    }

    get signature(){

        return this.$meta.signature ;
    }

    get exists(){

        !! this.$meta ;
    }

    get path(){

        return false ;
    }

    reset(){

    }

    destroy(){

    }
}

exports.SourceCode = SourceCode ;