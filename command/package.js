const application = require('../src/application'),
      compiler = require('../src/compiler'),
      {
          get:application_package_get
      } = require('../src/package/application');

module.exports = (name = 'default') =>{

    let config = application.get(`package.${name}`) ;

    if(config){

        console.log(application_package_get(config.includes)) ;
    }
}