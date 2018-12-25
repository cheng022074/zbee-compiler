(() =>{

    const nameRe = /^(\w+)\:{2}(.+?)$/,
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

            if(exports.hasOwnProperty(name)){

                return CODES[name] = exports[name] ;
            }
    
            folder = '<%- data %>',
            className = name ;
        }

        let fullName = `${folder}::${className}`,
            code = CODES[name] = exports[fullName] ;

        if(code === undefined && folder !== 'config'){

            throw new Error(`${fullName} 没有定义`) ;
        }

        return code ;
    } ;

})()