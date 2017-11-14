{
    const nameRe = /^([^\:]+)\:{2}(.+)$/,
          defaultPrefix = '<%- defaultScope %>',
          usedCodes = {},
          libraries = <%- libraries %>;

    function include(name){

        if(usedCodes.hasOwnProperty(name)){

            return usedCodes[name] ;
        }

        if(ZBEE_APPLICATION){

            let code = ZBEE_APPLICATION.getBinCode(name) ;

            if(code){

                return code.caller ;
            }

        }else{

            let match = name.match(nameRe),
                scope;

            if(match){

                scope = match[1].trim(),
                baseName = match[2].trim() ;

            }else{

                scope = defaultPrefix ;
            }

            let fullName = `${scope}::${baseName}` ;

            try{

                return  usedCodes[name] = usedCodes[fullName] = require(`../${scope}/${baseName}.js`) ;
            
            }catch(err){


            }

            for(let library of libraries){

                if(library.hasOwnProperty(fullName)){

                    return usedCodes[name] = usedCodes[fullName] =library[fullName] ;
                }
            }
        }
    }
}

<%- code %>