(() =>{

    const nameRe = /^(\w+)\:{2}(.+?)$/,
          CODES = {},
          libraries = <%- data.libraries %>;

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

        try{

            return CODES[name] = CODES[`${folder}::${className}`] = require(`../${folder}/${className}.js`) ;

        }catch(err){

            if(err.message.indexOf('Cannot find module') !== 0){
                    
                let len = libraries.length ;

                for(let i = 0 ; i < len ; i ++){

                    library = libraries[i] ;

                    if(typeof library === 'string'){

                        library = libraries[i] = require(library) ;
                    }
                    
                    if(library.hasOwnProperty(name)){

                        return library[name] ;
                    }
                }
            }

            throw err ;
        }
    } ;

})()