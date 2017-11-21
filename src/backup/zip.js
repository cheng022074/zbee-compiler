const {
    zip
} = require('../zip'),
application = require('../application'),
{
    join
} = require('path');

module.exports = (name , config) =>{

    console.log(name , config) ;

    let PATH = application.PATH ;

    zip({
        files:[{
            path:join(PATH , 'zb-dev')
        }]
    }) ;
}