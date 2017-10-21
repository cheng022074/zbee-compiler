const {
    get
} = require('../src/application/config'),
{
    format
} = require('../src/json');

module.exports = name =>{

    if(name){

        let config = get(name) ;

        if(config){

            console.log(format(config)) ;
        }
    }
}

