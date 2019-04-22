
const {
    APPLICATION,
    COMPILER
} = require('./project'),
{
    from
} = require('./array'),
{
    parse,
    toPath,
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
    getAllFilePaths,
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
{
    join
} = require('path'),
CODES = {
    BIN:{},
    SOURCE:{},
    LIBRARY_SOURCE:{}
},
{
    env
} = process;

class Code{

    /**
     * 
     * @private
     * 
     * 这是一个私有的代码对象获取方法
     * 
     * 通常不直接调用，而是通过子类的同名静态办法提供功能
     * 
     * 在 ZBEE 中，所有的代码必须使用此方法装载为对象
     * 
     * @param {string} type 代码类型名称
     * @param {Code} classRef 代码类型引用
     * @param {name} name 代码名称 
     * 
     * @return {Code} 代码对象
     * 
     */
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
baseNameRe = /[^\.]+$/,
nameSuffix = /\.?\*$/;

class SourceCode extends Code{

    static getMany(name){

        let me = this,
            fullName = normalize(name , defaultFolder) ;

        if(nameSuffix.test(fullName)){

            let {
                folder,
                name
            } = parse(fullName),
            rootPath = APPLICATION.getFolderPath(folder);

            let paths = getAllFilePaths(join(rootPath , toPath(name.replace(nameSuffix , '')))),
                codes = [];

            for(let path of paths){

                codes.push(me.get(`${folder}::${toName(path , rootPath)}`)) ;
            }

            return codes ;
        }

        return [
            me.getCode(me.get(name))
        ] ;
    }

    /**
     * 
     * 获取一个指定名称的源代码对象
     * 
     * @param {string} name 源代码名称
     * 
     * @return {SourceCode}
     *  
     */
    static get(name){

        if(nameSuffix.test(name)){

            throw new Error(`使用 ${name} 无法定位源代码`) ;
        }

        return Code.get('SOURCE' , this , name) ;

    }

    /**
     * 
     * 根据代码名称，获得当前工程以及所引用的类库里的代码对象
     * 
     * @param {string} name 代码名称
     * 
     * @return {SourceCode | LibrarySourceCode} 代码对象
     * 
     */
    static getCode(code){

        if(code.exists){

            return code ;
        }

        let libCode = Code.get('LIBRARY_SOURCE' , LibrarySourceCode , code.fullName) ;

        if(libCode.exists){

            return libCode ;
        }

        return code ;
    }

    /**
     * 
     * 源代码对象只会从当前工程进行实例
     * 
     * 但有时候需要从依赖的类库源代码中访问指定属性才能完成相关设计工作
     * 
     * 如需要得到指定源代码对象的所有依赖函数，则就需要类库源代码中的 importSourceCodes 属性参与进来
     * 
     * @param {SourceCode} code 源代码对象
     *  
     * @param {string} property 源代码对象的属性名称
     * 
     * @return {mixed} 基于源代码对象的指定属性值
     * 
     */
    static getProperty(code , property){

        code = this.getCode(code) ;

        if(code.exists){

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

    /**
     * 
     * 获取当前源代码的入口数据类型
     * 
     * 当源代码作为入口函数时，外部程序可以根据入口数据类型先进行数据转换后再传入参数值
     * 
     * @return {array}
     * 
     */

    get entryTypes(){

        return this.meta.entryTypes ;
    }

    /**
     * 
     * 获取当前源代码所引用的模块及其版本
     * 
     * @return {object}
     * 
     */

    get dependentModules(){

        return this.meta.dependentModules ;
    }

    /**
     * 
     * 获取当前源代码所引的函数资源
     * 
     * @return {object}
     * 
     */
    get dependentClasses(){

        return this.meta.dependentClasses ;
    }

    /**
     * 
     * 根据源代码配置获取代码媒体对象
     * 
     * 该媒体对象包含有所有的代码信息，包括依赖列表、参数列表等
     * 
     * @return {code.Meta} 代码媒体对象
     * 
     */
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

    getFilePath(suffix){

        let {
            name,
            folder
        } = this ;

        return join(APPLICATION.getFolderPath(folder) , toPath(name , suffix)) ;
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

    /**
     * 
     * 返回一组当前源代码对象依赖的源代码名称
     * 
     * @return {array}
     * 
     */
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

    get importNames(){

        let {
            importSourceCodes
        } = this,
        names = [];

        for(let {
            fullName
        } of importSourceCodes){

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

        }
    }

    getMeta(){

        let {
            $meta
        } = this ;

        if($meta){

            return copyTo({
                toString(){
    
                    return $meta.data ;
                }
            } , $meta , [
                'motifyTime',
                'signature',
                'importNames',
                'entryTypes',
                'dependentModules'
            ]) ;
        }

        return {} ;
    }

    get motifyTime(){

        return this.$meta.motifyTime ;
    }

    get signature(){

        return this.$meta.signature ;
    }

    get exists(){

        return !! this.$meta ;
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