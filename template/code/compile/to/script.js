{
    const nameRe = /^([^\:]+)\:{2}(.+)$/,
          defaultPrefix = '<%- defaultScope %>',
          usedCodes = {};

    function include(name){

        if(usedCodes.hasOwnProperty(name)){

            return usedCodes[name] ;
        }

        let match = name.match(nameRe) ;

        if(match){

            return usedCodes[name] = require(`../${match[1].trim()}/${match[2].trim()}.js`) ;
        }

        return usedCodes[name] = require(`../${defaultPrefix}/${name}.js`) ;
    }
}

<%- code %>