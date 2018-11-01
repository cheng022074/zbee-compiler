let {
    BinCode
} = require('../../code'),
compile = require('../../command/compile');

module.exports = codes =>{

    const codeMap = {};

    for(let {
        fullName
    } of codes){

        compile(fullName) ;

        applyCodeMap(codeMap , fullName) ;
    }

    return codeMap ;

}

function applyCodeMap(codeMap  , name){

    let {
        exists,
        target
    } = BinCode.get(name) ;

    if(exists){

       codeMap[name] = target ;
    
    }
}