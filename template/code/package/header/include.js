(() =>{

    const nameRe = /^(\w+)\:{2}(.+?)$/,
          CODES = {},
        {
            join
        } = require('path'),
        libraries = <%- JSON.stringify(data.libraries) %>;

    return name =>{

        if(exports.hasOwnProperty('include')){

            return exports.include(name) ;
        }

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

            let len = libraries.length ;

            for(let i = 0 ; i < len ; i ++){

                let library = libraries[i] ;

                if(typeof library === 'string'){

                    try{

                        library = libraries[i] = require(library) ;

                    }catch(err){

                        library = libraries[i] = undefined ;
                    }
                }

                if(library){

                    if(library.hasOwnProperty(fullName)){

                        return library[fullName] ;
                    }
                }
            }

            throw new Error(`${fullName} 没有定义`) ;
        }

        return code ;
    } ;

})()