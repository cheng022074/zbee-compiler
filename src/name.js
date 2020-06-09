const dotRe = /\./g,
{
    split,
    capitalize
} = require('./string');

exports.toPath = (name , suffix = '') =>{

    return `${name.replace(dotRe , '/')}${suffix}` ;
}

{
    const splitRe = /\:{2}|\./g ;

    exports.toFunctionName = name =>{

        return name.replace(splitRe , '_') ;
    }
}

exports.toBinFileName = (folder , name) => {

    if(folder === 'css'){

        return  `_${name.replace(/\./g , '_')}.scss` ;
    }

    return `${name}.js` ;

} ;

exports.toBinScriptFileName = name => `${name}.js` ;

exports.toBinSCSSFileName = name => `_${name.replace(/\./g , '_')}.scss` ;

exports.toBinCSSFileName = name => `${name}.css` ;

exports.toImportCSSFileName = (folder , name) => `${folder}_${name.replace(/\./g , '_')}.scss` ;

exports.toStylesheetCase = fullName =>{

    let {
        name,
        folder
    } = parse(fullName) ;

    let names = split(name , dotRe) ;

    let result = [] ;

    for(let name of names){

        result.push(name) ;
    }

    name = names.join('-') ;

    if(folder){

        name = `${folder}-${name}` ;
    }

    return name.toLowerCase() ;

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

    function parse(name , defaultFolder = ''){

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

            let {
                folder,
                name
            } = config ;

            if(folder){

                return `${folder}::${name}` ;
            }

            return name ;
        }
    }
}