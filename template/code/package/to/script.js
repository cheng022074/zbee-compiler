{
      const prefixRe = /^[^\:]+\:{2}/,
            defaultPrefix = '<%- defaultScope %>',
            usedCodes = {};

      function include(name){

            if(usedCodes.hasOwnProperty(name)){

                  return usedCodes[name] ;
            }

            if(prefixRe.test(name)){

                  return usedCodes[name] = exports[name] ;
            }

            return usedCodes[name] = exports[`${defaultPrefix}::${name}`] ;
            
      }

      exports.include = include ;

      exports.exists = name =>{

            return exports.hasOwnProperty(name) ;
      }
}

<%- code %>