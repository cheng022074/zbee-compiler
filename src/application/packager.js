const {
    get
} = require('../script'),
{
    from
} = require('../array');

class Packager{

    constructor({
        includes,
        excludes,
        folders
    }){

        
    }


}

exports.get = (names , project) =>{

    names = from(names) ;

    let paths = [],
        items = {} ;
    
    for(let name of names){

        let configs = project.parseSourceCodeNames(name) ;

        for(let config of configs){

            let {
                path,
                requires
            } = get(config.path , project) ;

            if(!items.hasOwnProperty(path)){

                paths.push(path) ;

                package(path , Object.values(items[path] = requires) , paths , items , layer) ;
            }
        }
    }

    return {
        paths,
        items
    } ;
}

function package(path , requirePaths , paths , items , layer){

    const {
        values
    } = Object ;

    for(let requirePath of requirePaths){

        if(!items.hasOwnProperty(requirePath)){

            paths.splice(paths.indexOf(path) , 0 , requirePath) ;

            package(path , values(items[requirePath] = get(requirePath , layer).requires) , paths , items , layer) ;
        }
    }
}