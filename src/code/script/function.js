const {
    ScriptMeta
} = require('../../script') ;

module.exports = (data , code) =>{

    let meta = new ScriptMeta(data) ;

    console.log(meta.scoped , meta.async , meta.runAt) ;

    return {
        
    } ;
}