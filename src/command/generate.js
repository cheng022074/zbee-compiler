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
} = require('../path');

module.exports = (name , suffix) =>{

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
            path = join(APPLICATION.rootPath , folder , toPath(baseName));

            if(!fileNormalize(path)){

                writeTextFile(`${path}${suffix}` , apply(template , {
                    name:baseName
                })) ;

                console.log('已生成' , name) ;
            
            }else{

                console.log('已存在' , name) ;
            }
        }
    }
}