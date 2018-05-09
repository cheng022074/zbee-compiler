const {
    APPLICATION
} = require('../project'),
compile = require('./compile');

module.exports = () =>{

    let names = APPLICATION.installNameList ;

    for(let name of names){

        compile(name) ;
    }
}