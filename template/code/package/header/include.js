(() =>{

    const nameRe = /^(\w+)\:{2}(.+?)$/,
          CODES = {},
        {
            join
        } = require('path');

    return name =>{

        if(CODES.hasOwnProperty(name)){

            return CODES[name] ;
        }

        let match = name.match(nameRe),
            folder,
            className;
    
        if(match){
    
            folder = match[1],
            className = match[2] ;
    
        }else{
    
            folder = '<%- data.defaultFolder %>',
            className = name ;
        }

        let name = `${folder}::${className}`,
            code = CODES[name] = exports[`${folder}::${className}`] ;

        if(code === undefined){

            throw new Error(`${name} 没有定义`) ;
        }
    } ;

})()