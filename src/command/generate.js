const {
    toPath,
    parse,
    normalize
} = require('../name'),
{
    APPLICATION
} = require('../project'),
{
    get:config_get
} = require('../config'),
{
    apply
} = require('../template'),
{
    writeTextFile
} = require('../fs'),
{
    join
} = require('path'),
{
    file:is_file
} = require('../is'),
{
    fileNormalize
} = require('../path'),
{
    extname
} = require('path'),
{
    SourceCode
} = require('../code');

function generate(name , suffix = '.fn.js' , options = {}){

    if(name && suffix){

        name = normalize(name , APPLICATION.defaultFolder) ;

        let {
            folder,
            name:baseName
        } = parse(name),
        config = config_get('code.source' , `${folder}.${suffix}`) ;

        if(config){

            let {
                template
            } =  config,
            path = join(APPLICATION.rootPath , folder , toPath(baseName)),
            filePath = fileNormalize(path);

            if(!filePath){

                writeTextFile(`${path}${suffix}` , apply(template , {
                    name:baseName,
                    ...options
                })) ;

                console.log('已生成' , name) ;
            
            }else{

                doGenerate(name) ;
            }
        }

    }else if(name){

        doGenerate(name) ;
    }
}

module.exports = generate ;

function doGenerate(name){

    let code = SourceCode.get(name) ;

    if(!code.exists){

        return ;
    }

    let {
        generates
    } = SourceCode.get(name).target.meta ;

    if(generates){

        for(let {
            name,
            suffix,
            ...options
        } of generates){
    
            let code = SourceCode.get(name) ;
    
            if(code.exists){
    
                continue ;
            }
    
            generate(name , suffix , options) ;
        }

    }
}