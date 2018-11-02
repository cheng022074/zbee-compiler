let {
    APPLICATION
} = require('../../project'),
{
    BinCode
} = require('../../code'),
compile = require('../../command/compile');

module.exports = codes =>{

    const {
        codeMap:dependentCodeMap
    } = APPLICATION.libraries,
    result = [];

    for(let code of codes){

        compile(code.fullName) ;

        pushCode(result , dependentCodeMap , code) ;
    }

    return result ;

}

function pushCode(codes , dependentCodeMap  , code){

    let {
        fullName:name,
        exists
    } = code,
    {
        target
    } = BinCode.get(name);

    if(target && !codes.includes(target)){

        if(!exists){
       
            let {
                imports
            } =  dependentCodeMap[name] ;
    
            for(let name of imports){
    
                pushCode(codes , dependentCodeMap , SourceCode.get(name)) ;
            }
        }

        codes.push(target) ;
    }
}