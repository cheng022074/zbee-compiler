const dotRe = /\./g,
{
    split,
    capitalize
} = require('./string');

exports.toPath = (name , suffix = '') =>{

    return `${name.replace(dotRe , '/')}${suffix}` ;
}

exports.toCamelCase = fullName =>{

    let {
        name,
        folder
    } = parse(fullName) ;

    let names = split(name , dotRe),
        firstName = names[0];

    names.shift() ;

    let result = [] ;

    for(let name of names){

        result.push(capitalize(name)) ;
    }

    name = `${firstName}${result.join('')}` ;

    if(folder){

        return `${folder}${capitalize(firstName)}${result.join('')}` ;
    }

    return `${firstName}${result.join('')}` ;
}

{
    const splitRe = /\:{2}/,
        {
            split
        } = require('./string');

    function parse(name , defaultFolder){

        let items = split(name , splitRe) ;

        switch(items.length){

            case 1:

                return {
                    folder:defaultFolder,
                    name
                } ;

            case 2:

                return {
                    folder:items[0],
                    name:items[1]
                } ;
        }
    }

    exports.parse = parse ;

    exports.normalize = (name , defaultFolder) =>{

        let config = parse(name , defaultFolder) ;

        if(config){

            return `${config.folder}::${config.name}` ;
        }
    }
}