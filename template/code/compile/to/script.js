{
    const nameRe = /^([^\:]+)\:{2}(.+)$/,
          defaultPrefix = '<%- defaultScope %>',
          usedCodes = {};

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

            return  usedCodes[name] = usedCodes[`${scope}::${baseName}`] = require(`../${scope}/${baseName}.js`) ;
        }
    }
}

<%- code %>