const {
    join:path_join
} = require('path'),
{
    name2path
} = require('./path'),
{
    function:is_function
} = require('./is');

exports.get = name =>{

    return require(path_join(__dirname , name2path(name))) ;
}

exports.execute = (name , ...args) =>{

    let target = exports.get(name) ;

    if(is_function(target)){

        return target(...args) ;
    }
}