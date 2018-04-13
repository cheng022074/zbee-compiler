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
} = require('../config'),
{
    APPLICATION
} = require('../project'),
{
    join
} = require('path');

module.exports = (name = 'default') =>{

    let {
        classes:names,
        name:fileName,
        bootstrap
    } = get('package' , name),
    codes = [];

    if(!fileName){

        fileName = name ;
    }
    
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

    let path = join(APPLICATION.getFolderPath('package') , `${fileName}.js`) ;

    writeTextFile(path , format(apply('code.package' , {
        codes,
        bootstrap,
        defaultFolder:APPLICATION.defaultFolder
    }))) ;

    console.log('已打包' , path) ;
}          