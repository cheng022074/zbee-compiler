const {
    APPLICATION
} = require('../project') ;

module.exports = (type = 'forward') =>{

    switch(type){

        case 'forward':

            forward() ;

            break ;

        case 'reverse':

            reverse() ;

            break ;

        default:

            forward() ;
    }
}

function forward(){

    console.log('正向工程') ;
}

function reverse(){

    console.log(APPLICATION.manifest) ;
}