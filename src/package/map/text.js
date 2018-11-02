let {
    APPLICATION
} = require('../../project'),
{
    SourceCode
} = require('../../code');

module.exports = codes =>{

    const {
        codeMap:dependentCodeMap
    } = APPLICATION.libraries,
    codeMap = {};

    for(let code of codes){

        applyCodeMap(codeMap , dependentCodeMap , code) ;
    }

    return codeMap ;

}

function applyCodeMap(codeMap , dependentCodeMap , code){

    let {
        fullName:name,
        importAllNames,
        exists
    } = code ;

    if(exists){

        codeMap[name] = {
            code:code.packageCodeText,
            aliases:code.aliases,
            imports:importAllNames
        } ;
    
    }else if(dependentCodeMap.hasOwnProperty(name)){

        let {
            imports
        } = codeMap[name] = dependentCodeMap[name] ;

        for(let name of imports){

            applyCodeMap(codeMap , dependentCodeMap , SourceCode.get(name)) ;
        }
    }
}