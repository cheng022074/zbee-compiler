const {
    defineCacheProperties
} = require('../../../object') ;

module.exports = class {

    constructor(code){

        defineCacheProperties(this , [
            'importNames',
            'code'
        ]) ;
    }

    applyImportNames(){

        return [] ;
    }

    applyCode(){

        return '' ;
    }
}