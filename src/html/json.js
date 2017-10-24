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

    attributes = Array.from(attributes) ;

    let encoder = new Encoder('entity');

    for(let attribute of attributes){

        let value = encoder.htmlEncode(attribute.value),
            name = attribute.name;

        if(placeholderTestRe.test(value)){

            fields[`attr::${name}`] = generate(value) ;

        }else{

            attrs[name] = value ;
        }
    }

    if(Object.keys(attrs).length){

        structure.attrs = attrs ;
    }

    if(children.length === 0){

        let innerHTML = encoder.htmlEncode(el.innerHTML) ;

        if(innerHTML){

            if(placeholderTestRe.test(innerHTML)){

                fields.html = generate(innerHTML) ;

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

let placeholderReplaceRe = /\{([^\{\}]+)\}/g,
    dataIndexReplaceRe = /\w+(?:\.\w+)*/g;

function generate(value){

    return [
        "const {get:object_get} = include('object');",
        `return \`${value.replace(placeholderReplaceRe , placeholder_replace)}\``
    ].join('\n') ;
}

function placeholder_replace(match , placeholder){

    return `\$\{${placeholder.replace(dataIndexReplaceRe , data_index_replace)}\}` ;
}

function data_index_replace(match){

    return `object_get(data , '${match}')` ;
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

    if(attrs){

        let names = Object.keys(attrs) ;
        
        for(let name of names){
    
            result.push(` ${name}="${attrs[name]}"`) ;
        }
    }

    result.push('>') ;

    if(cn){

        for(let item of cn){
    
            result.push(stringify(item)) ;
        }
    }

    result.push(`</${tag}>`) ;

    return result.join('') ;
}