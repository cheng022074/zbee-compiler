{
    const nameRe = /^([^\:]+)\:{2}(.+)$/,
          defaultPrefix = '<%- defaultScope %>',
          usedCodes = {};

    let libraries;

    function include(name){

        if(usedCodes.hasOwnProperty(name)){

            return usedCodes[name] ;
        }

        let match = name.match(nameRe),
            scope;

        if(match){

            scope = match[1].trim(),
            name = match[2].trim() ;

        }else{

            scope = defaultPrefix ;
        }

        let target = require(`../${scope}/${name}.js`) ;

        if(target){

            return  usedCodes[name] = target ;
        }

        if(!libraries){

            <%- libraries %>
        }

        if(libraries.length){

            return ;
        }

        let fullName = `${scope}::${name}` ;

        for(let library of libraries){

            let {
                include
            } = library ;

            let target = include(fullName) ;

            if(target){

                return target ;
            }
        }
    }
}

<%- code %>