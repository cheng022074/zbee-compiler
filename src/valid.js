const variableNameRe = /^[a-z_$]\w*$/i ;

exports.variableName = name =>{

    return variableNameRe.test(name) ;
}