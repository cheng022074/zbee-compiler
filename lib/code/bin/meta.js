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
    normalize
} = require('../../../src/name'),
{
    join
} = require('path');

class Meta{

    #data = {} ;

    #save;

    constructor(){

        let path = join(APPLICATION.getFolderPath('bin') , '.code_meta.json'),
            me = this;

        if(is_file(path)){

            me.#data = require(path) ;
        
        }

        me.#save = createBuffer(() => writeJSONFile(path , me.#data)) ;
    }

    save(codeName){

        codeName = getNormalizeName(codeName) ;

        let me = this,
            data = me.#data,
            code = SourceCode.get(codeName) ;

        if(code.exists){

            let {
                meta,
                folder,
                name,
                data:codeData
            } = code ;

            data[codeName] = {
                importNames:meta.importNames,
                data:codeData,
                folder,
                name,
                fullName:codeName
            } ;
            
            me.#save() ;
        }
    }

    has(name){

        let data = this.#data ;

        return data.hasOwnProperty(getNormalizeName(name)) ;
    }

    get(name){

        let me = this;

        if(me.has(name)){

            return me.#data[getNormalizeName(name)] ;
        }

        // 从附加的类库去寻找
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

function getNormalizeName(name) {
    
    return normalize(name , 'src') ;
}

module.exports = new Meta() ;