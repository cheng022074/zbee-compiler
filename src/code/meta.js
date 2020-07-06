const {
    defineProperties
} = require('../object'),
Body = require('./meta/body'),
{
    APPLICATION
} = require('../project');

class Meta{

    constructor(code , params){

        let me = this ;

        me.code = code ;

        me.metaParams = params ;

        defineProperties(me , me.getPropertyNames()) ;
    }

    getPropertyNames(){

        return [
            'header',
            'rawBody',
            'isAsync',
            'body',
            'imports',
            'requires',
            'configs',
            'params',
            'returnTypes',
            'hasMain',
            'isMainClass',
            'isStandard'
        ] ;
    }

    getIsStandard(){

        return true ;
    }

    getHeader(){

        return '' ;
    }

    getRawBody(){

        return '' ;
    }

    getBody(){

        return new Body(this) ;
    }

    getReturnTypes(){

        return [
            'void'
        ] ;
    }

    get signatureReturnTypes(){

        return get_signature_datatypes(this.returnTypes) ;
    }

    getHasMain(){

        return this.body.hasMain ;
    }

    getIsMainClass(){

        return this.body.isMainClass ;
    }

    getIsAsync(){

        return this.body.isAsync ;
    }

    get importNames(){

        let {
            imports,
            configs
        } = this,
        names = new Set();

        for(let {
            target
        } of imports){

            names.add(target) ;
        }

        for(let {
            target
        } of configs){

            names.add(`config::${target}`) ;
        }

        return Array.from(names) ;
    }

    getImports(){

        return [] ;
    }

    getRequires(){

        return [] ;
    }

    getConfigs(){

        return [] ;
    }

    getParams(){

        return [] ;
    }

    get entryTypes(){

        let {
            params
        } = this,
        types = [];

        for(let param of params){

            let {
                type,
                items
            } = param ;

            if(items.length){

                return [] ;

            }else{

                types.push(type) ;
            }
        }

        return types;
    }

    get paramSignatureNames(){

        let {
            params
        } = this,
        names = [];

        for(let param of params){

            let {
                type,
                items
            } = param ;

            if(items.length){

                let innerNames = [] ;

                for(let item of items){

                    innerNames.push(get_signature_name(item)) ;
                }

                let result = innerNames.join(' , ') ;

                switch(type){

                    case 'object':

                        names.push(`{${result}}`) ;
                        
                        break ;

                    case 'array':

                        names.push(`[${result}]`) ;
                }

            }else{

                names.push(get_signature_name(param)) ;
            }
        }

        return names.join(' , ') ;
    }

    get fragmentImportAllCodeDefinition(){

        let result = new Set(),
        {
            imports,
            configs
        } = this;

        for(let {
            name,
            scoped
        } of imports){

            if(!scoped){

                result.add(name) ;
            }
        }

        for(let {
            name
        } of configs){

            result.add(name) ;
        }

        result = Array.from(result) ;

        if(result.length){

            return `let ${result.join(',')};` ;
        }

        return '' ;
    }

    get fragmentImportAllCodeScopedAssignment(){

        let result = [],
        {
            imports
        } = this;

        for(let {
            name,
            target,
            scoped
        } of imports){

            if(scoped){

                result.push(`const ${name} = include('${target}').bind(this);`) ;

            }

        }

        return result.join('\n') ;
    }


    get fragmentImportAllCodeAssignment(){

        let result = [],
        {
            imports,
            configs
        } = this;

        for(let {
            name,
            target,
            scoped,
            value
        } of imports){

            if(!scoped){

                if(value){

                    result.push(`${name} = include('${target}')();`) ;
                
                }else{

                    result.push(`${name} = include('${target}');`) ;
                }
            }

        }

        for(let {
            name,
            target,
            key
        } of configs){

            if(key){

                result.push(`${name} = config('${target}' , '${key}');`) ;
            
            }else{

                result.push(`${name} = config('${target}');`) ;
            }
        }

        return result.join('\n') ;
    }

    get dependentModules(){

        let {
            requires
        } = this,
        result = {},
        {
            dependentModules
        } = APPLICATION;

        for(let name of requires){

            if(dependentModules.hasOwnProperty(name)){

                result[name] = dependentModules[name] ;
            }
        }

        return result ;
    }
    
    /**
     * 
     * 返回当前依赖的函数名称及其类型
     * 
     * @return {object}
     * 
     */
    get dependentClasses(){

        let result = {},
            me = this,
            {
                configs,
                imports
            } = me;

        for(let {
            target
        } of configs){

            result[target] = '.json' ;
        }

        for(let {
            target
        } of imports){

            result[target] = me.getDependentClassSuffix(target) ;
        }

        return result ;
    }

    getDependentClassSuffix(name){

        return '.fn.js' ;
    }

    toString(){

        return '() =>{}' ;
    }
}

function get_signature_name({
    name,
    rest,
    types
}){

    return `${get_signature_datatypes(types)} ${rest ? '...' : ''}${name}` ;
}

function get_signature_datatypes(types){

    return `<${types.join('|')}>` ;
}

module.exports = (...args) =>{

    if(args.length){

        return new Meta(...args) ;
    }

    return Meta ;
}