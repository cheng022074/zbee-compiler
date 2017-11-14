const {
    file:is_file,
    defined:is_defined
} = require('./is'),
{
    readTextFile,
    readHTMLFile,
    readJSONFile,
    readXMLFile,
    getFileUpdateTime
} = require('./fs'),
{
    defineKey,
} = require('./object'),
{
    require:module_require
} = require('./module'),
baseSuffixRe = /\.[^\.]+$/,
lastNameRe = /[^\.]+$/;

class Code{

    constructor(project , config){

        let {
            path,
            name,
            scope,
            suffix
        } = config,
        me = this;

        me.project = project ;

        me.path = path ;

        me.name = name ;

        me.scope = scope ;

        me.suffix = suffix ;

        if(path){

            me.updateTime = getFileUpdateTime(path) ;
        }
    }

    get baseSuffix(){

        return defineKey(this , '$baseSuffix' , 'generateBaseSuffix') ;
    }

    get fullName(){

        return defineKey(this , '$fullName' , 'generateFullName') ;
    }

    get shortName(){

        return defineKey(this , '$shortName' , 'generateShortName') ;
    }

    generateBaseSuffix(){

        let {
            suffix
        } = this ;

        return suffix.match(baseSuffixRe)[0] ;
    }

    generateFullName(){

        let {
            scope,
            name
        } = this ;

        return `${scope}::${name}` ;
    }

    generateShortName(){

        let {
            name
        } = this ;

        return name.match(lastNameRe)[0];
    }

    get isFile(){

        let me = this ;

        let path = this.path ;

        if(path){

            return is_file(me.path) ;
        }

        return false ;
    }

    get isUpdated(){

        let me = this,
            path = me.path;

        if(path){

            return getFileUpdateTime(path) !== me.updateTime ;
        }

        return false ;
    }

    sync(){

        let me = this ;

        if(me.isUpdated === true){

            me.doSync() ;
        }
    }

    doSync(){

        let me = this ;

        me.updateTime = getFileUpdateTime(me) ;
    }
}

class BinCode extends Code{

    get caller(){

        return defineKey(this , '$caller' , 'generateCaller') ;
    }

    get isFile(){

        return !!(super.isFile && this.caller) ;
    }

    generateCaller(){

        let me = this,
            path = me.path ;

        if(path){

            if(me.scope === 'template'){
                
                return readTextFile(path) ;
            }
    
            switch(me.suffix.match(baseSuffixRe)[0]){
                
                case '.json':
    
                    return readJSONFile(path) ;
    
                case '.js':
    
                    return module_require(path) ;
    
                case '.xml':
    
                    return readXMLFile(path) ;
    
                case '.html':
    
                    return readHTMLFile(path) ;
            }
    
            return readTextFile(path) ;

        }
    }

    doSync(){

        super.doSync() ;

        delete this.$caller ;
    }
}

exports.BinCode = BinCode ;


class SourceCode extends Code{

    get code(){

        return defineKey(this , '$code' , 'generateCode') ;
    }

    get isFile(){

        return !!(super.isFile && is_defined(this.code)) ;
    }

    generateCode(){

        let me = this,
            path = me.path ;

        if(path){

            if(me.scope === 'template'){
                
                return readTextFile(path) ;
            }
    
            switch(me.baseSuffix){
                
                case '.json':
    
                    return readJSONFile(path) ;
    
                case '.xml':
    
                    return readXMLFile(path) ;
    
                case '.html':
    
                    return readHTMLFile(path) ;
            }
    
            return readTextFile(path) ;
        }
    }

    doSync(){

        super.doSync() ;

        delete this.$code ;
    }
}

exports.SourceCode = SourceCode ;