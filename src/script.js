const {
    join:path_join
} = require('path'),
{
    name2path
} = require('./path'),
{
    function:is_function,
    class:is_class,
    file:is_file,
    defined:is_defined
} = require('./is'),
{
    from:array_from
} = require('./array'),
{
    get:properties_get
} = require('./properties');

const libraries = [] ;

{
    let paths = array_from(properties_get('run.path.libraries')),
        rootPath = process.cwd();

    for(let path of paths){

        path = path_join(rootPath , path) ;

        if(is_file(path)){

            libraries.push(require(path)) ;
        }
    }
}

const cache = {} ;

function get(name , isCache = true){

    if(isCache === false){

        delete cache[name] ;
    }

    let bootPath = properties_get('run.path.bin') ;
    
    if(is_defined(bootPath)){

        bootPath = path_join(process.cwd() , bootPath) ;

    }else{

        bootPath = process.cwd() ;
    }

    let path = path_join(bootPath , `${name2path(name)}.js`) ;

    if(is_file(path)){

        return cache[name] = require(path) ;
    }

    for(let library of libraries){

        if(library.hasOwnProperty(name)){

            return cache[name] = library[name] ;
        }
    }

    return cache[name] = require(path_join(__dirname , name2path(name))) ;
}

exports.has = name =>{

    return is_defined(get(name)) ;
}

exports.get = (name , isCache) =>{

    return get(name , isCache) ;
}

exports.execute = (name , ...args) =>{

    let target = exports.get(name) ;

    if(is_function(target)){

        return target(...args) ;

    }else if(is_class(target)){

        let main = target.main ;

        if(is_function(main)){

            return main(...args) ;
        }
    }
}