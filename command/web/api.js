const {
    input
} = require('../../src/web/api'),
{
    get:properties_get
} = require('../../src/properties'),
{
    string:is_string
} = require('../../src/is'),
{
    format:json_format
} = require('../../src/json'),
{
    format:html_format
} = require('../../src/html');

module.exports = async function(method , uri , ...args){

    let url = `${properties_get('web.api.domain')}/${uri}` ;

    console.log('已请求' , method.toUpperCase() , url) ;

    let body = await input(url , method) ;

    if(is_string(body)){

        console.log(html_format(body)) ;

    }else{

        console.log(json_format(body)) ;
    }
}