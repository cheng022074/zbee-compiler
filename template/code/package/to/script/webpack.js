
const exports = {},
      prefixRe = /^[^\:]+\:{2}/,
      defaultPrefix = '<%- defaultScope %>',
      usedCodes = {};

export function include(name){

      if(usedCodes.hasOwnProperty(name)){

            return usedCodes[name] ;
      }

      if(prefixRe.test(name)){

            return usedCodes[name] = exports[name] ;
      }

      return usedCodes[name] = exports[`${defaultPrefix}::${name}`] ;
}

<%- code %>

export default exports ;