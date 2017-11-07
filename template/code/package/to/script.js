const codes = {},
      prefixRe = /^[^\:]+\:{2}/,
      defaultPrefix = '<%- defaultScope %>',
      include = exports.include = name =>{

            if(prefixRe.test(name)){

            return codes[name] ;
            }

            return codes[`${defaultPrefix}::${name}`] ;
      }

{
    const exports = codes ;

    <%- code %>
}