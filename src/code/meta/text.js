const 
{
    readTextFile
} = require('../../fs');

module.exports = class {

    constructor(code){

        let me = this ;

        me.code = readTextFile(code.path) ;

        me.importNames = [] ;
    }
}