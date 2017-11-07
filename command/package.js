const application = require('../src/application'),
      Packager = require('../src/application/code/packager');

module.exports = (name = 'default') =>{

    let config = application.get(`package.${name}`) ;

    if(config){

        let packager = new Packager(config) ;

        console.log(packager.sourceCodes) ;
    }
}