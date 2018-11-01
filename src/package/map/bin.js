let {
    BinCode
} = require('../../code');

module.exports = codes =>{

    const codeMap = {};

    for(let {
        fullName
    } of codes){

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