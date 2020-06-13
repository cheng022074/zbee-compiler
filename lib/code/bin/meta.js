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

    save(name){

        let me = this,
            data = me.#data ;

        if(!data.hasOwnProperty(name)){

            let code = SourceCode.get(name) ;

            if(code.exists){

                data[name] = {
                    imports:code.meta.imports
                } ; 
            
            }else{

                data[name] = false;
            }
            
            me.#save() ;
        }
    }

    get(name){

        return this.#data[name] ;
    }
}

module.exports = new Meta() ;