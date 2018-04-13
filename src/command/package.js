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
    format,
    min
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
        bootstrap,
        compress
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

    let path = join(APPLICATION.getFolderPath('package') , `${fileName}.js`),
        data = apply('code.package' , {
            codes,
            bootstrap,
            defaultFolder:APPLICATION.defaultFolder
        });

    if(compress){

        data = min(data) ;
    
    }else{

        data = format(data) ;
    }    

    writeTextFile(path , data) ;

    console.log('已打包' , path) ;
}          