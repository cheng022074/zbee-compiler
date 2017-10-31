const application = require('../src/application'),
      compiler = require('../src/compiler'),
      {
          get:application_package_get
      } = require('../src/package/application'),
      {
          get:compiler_package_get
      } = require('../src/package/compiler');

module.exports = (name = 'default') =>{

    let config = application.get(`package.${name}`) ;

    if(config){

        console.log(compiler_package_get(config.compiler)) ;
    }
}