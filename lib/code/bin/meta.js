const is_file = require('../../is/file'),
      createBuffer = require('../../function/buffer'),
      writeJSONFile = require('../../file/write/json');

const {
    APPLICATION
} = require('../../../src/project'),
{
    SourceCode
} = require('../../../src/code'),
{
    join
} = require('path');

const namespaceRe = /\.?\*$/;

const {
    assign,
    keys
} = Object ;

class Meta{

    #data = {} ;

    #save;

    #externalData = {};

    constructor(){

        let path = join(APPLICATION.getFolderPath('bin') , '.code_meta.json'),
            me = this;

        if(is_file(path)){

            me.#data = require(path) ;
        
        }

        me.#save = createBuffer(() => writeJSONFile(path , me.#data)) ;

        let {
            rootPath
        } = APPLICATION,{
            libraries = []
        } = require(join(rootPath , 'properties.json')),
        data = me.#externalData;

        libraries.reverse() ;

        for(let library of libraries){

            let path = join(rootPath , 'node_modules' , library , 'meta.json') ;

            if(is_file(path)){

                assign(data , require(path)) ;
            }
        }
    }

    remove(codeName){

        let me = this,
            data = me.#data;

        if(data.hasOwnProperty(codeName)){

            delete data[codeName] ;

            me.#save() ;
        }
    }

    save(codeName){

        let me = this,
            data = me.#data,
            code = SourceCode.get(codeName) ;

        if(code.exists){

            let {
                meta,
                folder,
                name,
                data:codeData,
                signature,
                metaName
            } = code,
            {
                importNames,
                dependentModules,
                isStandard:standard
            } = meta;

            data[codeName] = {
                meta:metaName,
                signature,
                standard,
                importNames,
                dependentModules,
                data:codeData,
                folder,
                name
            } ;

            me.#save() ;

            return true ;
        }

        return false ;
    }

    has(name){

        let me = this;

        return me.#data.hasOwnProperty(name) || me.#externalData.hasOwnProperty(name);
    }

    get(name){

        let me = this;

        if(me.has(name)){

            return me.#data[name] || me.#externalData[name];
        }
    }

    getExternalAllNames(name){

        let data = this.#externalData ;

        if(namespaceRe.test(name)){

            let matchNamePrefix = name.replace(namespaceRe , ''),
                names = keys(data),
                result = [];

            for(let name of names){

                if(name.indexOf(matchNamePrefix) === 0){

                    result.push(name) ;
                }
            }

            return result ;
        
        }else if(data.hasOwnProperty(name)){

            return [
                name
            ] ;
        }

        return [];
    }

    getImportAllNames(name){

        let me = this ;

        if(!me.has(name)){

            return [] ;
        }

        let importAllNames = [
            name
        ] ;
        
        getImportNames.call(me , name , me.get(name) , importAllNames) ;

        importAllNames.pop() ;

        return importAllNames ;
    }

    getMetaType(name){

        let me = this ;

        if(me.has(name)){

            let {
                meta
            } = me.get(name) ;

            switch(meta){

                case 'code.meta.scss':

                    return 'css' ;
            }

            return 'script' ;
        }
    }
}

function getImportNames(name , {
    importNames
} , importAllNames){

    let me = this ;

    for(let importName of importNames){

        if(!importAllNames.includes(importName) && me.has(importName)){

            importAllNames.splice(importAllNames.indexOf(name) , 0 , importName) ;

            getImportNames.call(me , importName , me.get(importName) , importAllNames) ;
        }
    }
}

module.exports = new Meta() ;