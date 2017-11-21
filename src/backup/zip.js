const {
    zip
} = require('../zip'),
application = require('../application'),
{
    join
} = require('path');

module.exports = (name , {
    includes,
    target
}) =>{

    let PATH = application.PATH ;

    if(target){
        
        path = join(PATH , target) ;

    }else{

        path = join(application.BACKUP_PATH , `${packager.name}.zip`) ;
    }

    zip({
        files:[{
            path:join(PATH , 'zb-dev')
        }]
    }) ;
}