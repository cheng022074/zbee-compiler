
function init(el , structure){

    structure.tag = el.tagName.toLowerCase() ;

    let attrs = {} ;

    let {
        attributes,
        children
    } = el ;

    for(let attribute of attributes){

        attrs[attribute.name] = encode(attribute.value) ;
    }

    if(Object.keys(attrs).length){

        structure.attrs = attrs ;
    }

    if(children.length === 0){

        let innerHTML = encode(el.innerHTML) ;

        if(innerHTML){

            structure.html = innerHTML ;
        }
    }
}

const enterRe = /\r|\n/g,
      squotRe = /\'/g,
      dquotRe = /\"/g;

function encode(value){

    return value.replace(enterRe , '').replace(squotRe , '\\').replace(dquotRe , '\\"').trim() ;
}

module.exports = init;