const application = require('../src/application/config'),
{
    format
} = require('../src/json');

module.exports = name =>{


    if(name){

        let config = application.get(name) ;

        if(config){

            console.log(format(config)) ;
        }
    }
}