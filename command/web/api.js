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
} = require('../../src/html'),
{
    set:object_set
} = require('../../src/object'),
argRe = /^([^\:]+)\:{2}([^\:]+)\:([^\:]+)$/;

module.exports = async function(method , uri , ...args){

    let url = `${properties_get('web.api.domain')}/${uri}` ;

    let options = {} ;

    for(let arg of args){

        let match = arg.match(argRe) ;

        if(match){

            let optionType = match[1].trim() ;

            switch(optionType){

                case 'query':
                case 'path':
                case 'body':

                    object_set(options , `${optionType}.${match[2].trim()}` , match[3].trim()) ;
            }
        }
    }

    if(options.hasOwnProperty('query')){

        print_params('查询参数:' , options.query) ;
    }

    if(options.hasOwnProperty('path')){

        print_params('路径参数:' , options.path) ;
    }

    if(options.hasOwnProperty('body')){

        print_params('主体参数:' , options.body) ;
    }

    console.log('已请求' , method.toUpperCase() , url) ;

    let body = await input(url , method , options) ;

    console.log('返回结果:') ;

    if(is_string(body)){

        console.log(html_format(body)) ;

    }else{

        console.log(json_format(body)) ;
    }
}

function print_params(title , params){

    console.log(title) ;

    console.log(json_format(params)) ;
}