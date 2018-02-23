const dotRe = /\./g ;

exports.toPath = (name , suffix = '.js') =>{

    return `${name.replace(dotRe , '/')}${suffix}` ;
}

{
    const splitRe = /\:{2}/,
        {
            split
        } = require('./string'),
        {
            defaultFolder
        } = require('./application');

    function parse(name){

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

    exports.normalize = name =>{

        let config = parse(name) ;

        if(config){

            return `${config.folder}::${config.name}` ;
        }
    }
}