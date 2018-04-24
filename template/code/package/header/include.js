(() =>{

    const nameRe = /^(\w+)\:{2}(.+?)$/,
          CODES = {},
        {
            join
        } = require('path'),
        libraries = [],
        {
            env
        } = process,
        libraryPathRe = /[^\;]+/g,
        libraryPath = env['ZBEE-APP-LIB-PATH'];

    if(libraryPath){

        let match ;

       /* while(match = libraryPathRe.exec(libraryPath)){

            let path = match[0] ;

            if(path !== __filename){

                libraries.push(require(path)) ;
            }
        }*/
    }

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

        let fullName = `${folder}::${className}`,
            code = CODES[name] = exports[fullName] ;

        if(code === undefined){

            for(let library of libraries){

                if(library.hasOwnProperty(fullName)){

                    return code = CODES[name] = library[fullName] ;
                }
            }

            throw new Error(`${fullName} 没有定义`) ;
        }

        return code ;
    } ;

})()