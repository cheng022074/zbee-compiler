const {
    string:is_string,
    htmlDocument:is_html_document,
    htmlElement:is_html_element,
    simpleObject:is_simple_object
} = require('../is'),
{
    parse
} = require('../html');

exports.parse = data =>{

    let el ;

    if(is_string(data)){

        data = parse(data) ;
    
    }
    
    if(is_html_document(data)){

        el = data.documentElement ;
    
    }else if(is_html_element(data)){

        el = data ;
    }
}

const placeholderTestRe = /\{[^\{\}]+\}/;

function parse(el){

    let structure = {
            tag:el.tagName.toLowerCase()
        } ;

    let attrs = {},
        dataIndexes = {},
        vm = {};

    let {
        attributes,
        children
    } = el ;

    for(let attribute of attributes){

        let value = encode(attribute.value),
            name = attribute.name;

        attrs[name] = value ;

        if(placeholderTestRe.test(value)){

            name = `attr::${name}` ;

            vm[name] = value ;

            mv_set(mv , value , name) ;
        }
    }

    if(Object.keys(attrs).length){

        structure.attrs = attrs ;
    }

    if(children.length === 0){

        let innerHTML = encode(el.innerHTML) ;

        if(innerHTML){

            structure.html = innerHTML ;

            if(placeholderTestRe.test(innerHTML)){

                vm.html = innerHTML ;

                mv_set(mv , innerHTML , 'html') ;
            }
        }

    }else{

        let cn = structure.cn = [] ;

        for(let childEl of children){

            cn.push(parse(childEl)) ;
        }
    }

    return structure ;
}

const enterRe = /\r|\n/g,
      squotRe = /\'/g,
      dquotRe = /\"/g;

function encode(value){

    return value.replace(enterRe , '').replace(squotRe , '\\\'').replace(dquotRe , '\\"').trim() ;
}

function mv_set(target , name , value){

    if(!target.hasOwnProperty(name)){

        target[name] = [
            value
        ] ;

    }else{

        target[name].push(value) ;
    }
}

exports.stringify = data =>{

    if(is_simple_object(data)){


    }
}