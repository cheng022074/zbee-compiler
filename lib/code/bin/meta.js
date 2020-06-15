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
            data = me.#data,
            code = SourceCode.get(name) ;

        if(code.exists){

            data[name] = {
                importNames:code.meta.importNames
            } ;
            
            me.#save() ;
        }
    }

    get(name){

        let data = this.#data ;

        if(data.hasOwnProperty(name)){

            return data[name] ;
        }

        // 从附加的类库去寻找
    }
}

module.exports = new Meta() ;