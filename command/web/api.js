const {
    input
} = require('../../src/web/api'),
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
string = require('../../src/string'),
argRe = /^([^\:]+)\:{2}([^\:]+)\:([^\:]+)(?:\:([^\:]+))?$/;

module.exports = async function(method , uri , ...args){

    let options = {} ;

    for(let arg of args){

        let match = arg.match(argRe) ;

        if(match){

            let optionType = match[1].trim() ;

            switch(optionType){

                case 'query':
                case 'path':
                case 'body':

                    let value = match[3].trim()
                        datatype = match[4];

                    if(datatype){

                        let method = `to${string.capitalize(datatype)}` ;

                        if(string.hasOwnProperty(method)){

                            value = string[method](value) ;
                        }
                    }

                    object_set(options , `${optionType}.${match[2].trim()}` , value) ;
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

    let body = await input(uri , method , options) ;

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