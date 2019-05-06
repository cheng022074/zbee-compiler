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
    writeTextFile,
    remove
} = require('../fs'),
{
    join
} = require('path'),
{
    fileNormalize
} = require('../path'),
{
    SourceCode
} = require('../code'),
{
    env
} = process;

function generate(name , suffix){

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

            if(!filePath && !SourceCode.getCode(SourceCode.get(name)).exists){

                writeTextFile(`${path}${suffix}` , apply(template , {
                    name:baseName
                })) ;

                console.log('已生成' , name) ;
            
            }else if(env['ZBEE-PARAM-FORCE'] === 'force'){

                remove(filePath) ;

                generate(name , suffix) ;
                
            }else{

                console.log('已存在' , name) ;
            }
        }

    }
}

module.exports = generate ;