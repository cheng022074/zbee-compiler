{
      const prefixRe = /^[^\:]+\:{2}/,
            defaultPrefix = '<%- defaultScope %>',
            usedCodes = {};

      function include(name){

            if(usedCodes.hasOwnProperty(name)){

                  return usedCodes[name] ;
            }

            if(prefixRe.test(name)){

                  return usedCodes[name] = codes[name] ;
            }

            return usedCodes[name] = codes[`${defaultPrefix}::${name}`] ;
      }

      exports.include = include ;
}

{

    <%- code %>
}