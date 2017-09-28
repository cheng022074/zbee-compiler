const {
    join:path_join
} = require('path'),
{
    name2path
} = require('./path');

exports.get = name =>{

    return require(path_join(__dirname , name2path(name))) ;
}