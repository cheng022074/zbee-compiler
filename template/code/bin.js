const include = (() =>{

    const nameRe = /^(\w+)\:(.+?)$/,
          CODES = {};

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
    
        const {
            join
        } = require('path') ;
    
        return CODES[name] = CODES[`${folder}::${className}`] = require(`../${folder}/${className}.js`) ;

    } ;

})() ;