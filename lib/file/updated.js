const getUpdatedTime = require('./updated/time'),
      is_file = require('../is/file'),
      createBuffer = require('../function/buffer'),
      writeJSONFile = require('./write/json');

const {
    APPLICATION
} = require('../../src/project'),
{
    join
} = require('path');

class Updated{

    #data = {} ;

    #reset;

    #updatedTimes = {} ;

    #getUpdatedTime ;

    constructor(){

        let path = join(APPLICATION.getFolderPath('bin') , '.file_updated_times.json'),
            me = this;

        if(is_file(path)){

            me.#data = require(path) ;
        
        }

        me.#reset = createBuffer(() => writeJSONFile(path , me.#data)) ;

        me.#getUpdatedTime = path => {

            let times = me.#updatedTimes ;

            if(!times.hasOwnProperty(path)){

                return times[path] = getUpdatedTime(path);
            }

            return times[path] ;
        } ;
    }

    is(path){

        let me = this,
            data = me.#data ;

        if(data.hasOwnProperty(path)){

            return data[path] !== me.#getUpdatedTime(path) ;
        }
        
        return true ;
    }

    reset(path){

        let me = this ;

        me.#data[path] = me.#getUpdatedTime(path) ;

        me.#reset() ;
    }
}

module.exports = new Updated() ;