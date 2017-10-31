const compiler = require('../compiler'),
{
  get
} = require('../package');

exports.get = names =>{

    return get(names , compiler) ;
}