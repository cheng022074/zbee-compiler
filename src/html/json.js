const {
    string:is_string,
    htmlDocument:is_html_document,
    htmlElement:is_html_element,
    simpleObject:is_simple_object
} = require('../is'),
{
    parse:html_parse
} = require('../html'),
{
    Encoder
} = require('node-html-encoder');

exports.parse = data =>{

    let el ;

    if(is_string(data)){

        data = html_parse(data) ;
    
    }
    
    if(is_html_document(data)){

        el = data.documentElement ;
    
    }else if(is_html_element(data)){

        el = data ;
    }

    return parse(el) ;
}

const placeholderTestRe = /\{[^\{\}]+\}/;

function parse(el){

    let structure = {
        tag:el.tagName.toLowerCase()
    } ;

    let attrs = {},
        fields = {};

    let {
        attributes,
        children
    } = el ;

    for(let attribute of attributes){

        let value = encode(attribute.value),
            name = attribute.name;

        if(placeholderTestRe.test(value)){

            fields[`attr::${name}`] = value ;

        }else{

            attrs[name] = value ;
        }
    }

    if(Object.keys(attrs).length){

        structure.attrs = attrs ;
    }

    if(children.length === 0){

        let innerHTML = encode(el.innerHTML) ;

        if(innerHTML){

            if(placeholderTestRe.test(innerHTML)){

                fields.html = innerHTML ;

            }else{

                structure.html = innerHTML ;
            }
        }

    }else{

        let cn = structure.cn = [] ;

        for(let childEl of children){

            cn.push(parse(childEl)) ;
        }
    }

    if(Object.keys(fields).length){

        structure.fields = fields ;
    }

    return structure ;
}

exports.stringify = data =>{

    if(is_simple_object(data)){

        return stringify(data) ;
    }
}

function stringify(data){

    let result = [],
        {
            tag,
            attrs,
            cn,
            html
        } = data;

    result.push(`<${tag}`) ;

    let names = Object.keys(attrs) ;

    for(let name of names){

        result.push(` ${name}="${attrs[name]}"`) ;
    }

    result.push('>') ;

    for(let item of cn){

        result.push(stringify(item)) ;
    }

    result.push(`</${tag}>`) ;

    return result.join('') ;
}