const application = require('../application'),
      {
        get
      } = require('../package');

exports.get = names =>{

    return get(names , application) ;
}