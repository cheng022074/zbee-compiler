const dotRe = /\./g ;

exports.toPath = (name , suffix = '') =>{

    return `${name.replace(dotRe , '/')}${suffix}` ;
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