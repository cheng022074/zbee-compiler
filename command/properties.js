const application = require('../src/application'),
      {
          format
      } = require('../src/json');

module.exports = () =>{

    console.log(format(application.PROPERTIES)) ;
}