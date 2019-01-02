const build = require('../build') ;

function build_xml(data , name){

    let {
        tagName,
        attributes,
        childNodes
    } = data,
    result = {
        tag:tagName
    };

    attributes = Array.from(attributes) ;

    let attrs = {} ;

    for(let {
        name,
        value
    } of attributes){

        attrs[name] = value ;
    }

    result.attributes = attrs ;

    let children = [],
        texts = [];

    childNodes = Array.from(childNodes) ;

    for(let node of childNodes){

        let {
            nodeType
        } = node ;

        switch(nodeType){

            case 1:

                children.push(build_xml(node , name)) ;

                break ;

            case 3:
            case 4:

                texts.push(node.nodeValue) ;
        }
    }

    result.children = children ;

    let text = texts.join('').trim() ;

    if(text){

        result['@text'] = text ;
    }

    return build(result , name) ;
}

module.exports = build_xml ;