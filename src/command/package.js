const {
    SourceCode
} = require('../code'),
{
    writeTextFile
} = require('../fs'),
{
    apply
} = require('../template'),
{
    format
} = require('../script'),
{
    get
} = require('../config') ;

module.exports = (name = 'default') =>{

    let {
        classes:names
    } = get('package' , name),
    codes = [];
    
    for(let name of names){

        let code = SourceCode.get(name) ;

        if(code.exists){

            let {
                importAllSourceCodes
            } = code ;
    
            for(let code of importAllSourceCodes){

                if(code.exists){

                    codes.push(code) ;
                }
            }

            codes.push(code) ;
        }
    }

    format(apply('code.package' , {
        codes
    })) ;

    writeTextFile() ;
}          