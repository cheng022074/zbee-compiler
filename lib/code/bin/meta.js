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

const {
    assign
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

    save(codeName){

        let me = this,
            data = me.#data,
            code = SourceCode.get(codeName) ;

        if(code.exists){

            let {
                meta,
                folder,
                name,
                data:codeData
            } = code,
            {
                importNames,
                dependentModules,
                isStandard:standard
            } = meta;

            data[codeName] = {
                standard,
                importNames,
                dependentModules,
                data:codeData,
                folder,
                name,
                fullName:codeName
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