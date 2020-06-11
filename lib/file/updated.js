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

    constructor(){

        let path = join(APPLICATION.getFolderPath('bin') , '.updated_times.json'),
            me = this;

        if(is_file(path)){

            me.data = require(path) ;
        }

        me.data = {} ;

        me.doReset = createBuffer(() => writeJSONFile(path , me.data)) ;
    }

    is(path){

        let {
            data
        } = this ;

        if(data.hasOwnProperty(path)){

            return data[path] !== getUpdatedTime(path) ;
        }
        
        return true ;
    }

    reset(path){

        let me = this ;

        me.data[path] = getUpdatedTime(path) ;

        me.doReset() ;
    }
}

module.exports = new Updated() ;