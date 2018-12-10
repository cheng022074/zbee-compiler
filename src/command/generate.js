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

function generate(name , suffix , options = {}){

    if(name){

        name = normalize(name , APPLICATION.defaultFolder) ;

        let {
            folder,
            name:baseName
        } = parse(name) ;
        
        suffix = suffix || config_get('code.source' , `${folder}.defaultSuffix`) ;

        if(!suffix){

            return ;
        }

        let config = config_get('code.source' , `${folder}.suffixes.${suffix}`) ;

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

                console.log('已存在' , name) ;
            }
        }

    }
}

module.exports = generate ;