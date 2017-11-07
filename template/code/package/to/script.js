const codes = {} ;

{
    const exports = codes ;

    <%- code %>
}

const prefixRe = /^[^\:]+\:{2}/,
      defaultPrefix = '<%- defaultScope %>';

exports.include = name =>{

    if(prefixRe.test(name)){

        return codes[name] ;
    }

    return codes[`${defaultPrefix}::${name}`] ;
}