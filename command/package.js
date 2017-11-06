const application = require('../src/application'),
      compiler = require('../src/compiler'),
      application = require('../src/package/application');

module.exports = (name = 'default') =>{

    let config = application.get(`package.${name}`) ;

    if(config){

        console.log(compiler_package_get(config.compiler)) ;
    }
}