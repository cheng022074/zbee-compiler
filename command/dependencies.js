const {
    DEPENDENCIES
} = require('../src/compiler') ;

module.exports = () =>{

    let names = Object.keys(DEPENDENCIES) ;

    for(let name of names){

        console.log(name) ;
    }
}