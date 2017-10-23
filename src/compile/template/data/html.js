const {
    unique
} = require('../../../array') ;

module.exports = doc =>{

    let codes = [],
        params = [] ;

    generate(doc.documentElement , codes , params) ;

    params = unique(params) ;

    return {
        params,
        code:codes.join('\n')
    } ;
}

function generate(el , codes , params){

    let tag = el.tagName.toLowerCase() ;

    let attributes = Array.from(el.attributes) ;

    if(attributes.length){

        codes.push(`result.push('<${tag}');`) ;
        
        for(let attribute of attributes){
    
            codes.push(`result.push(\` ${attribute.name} = "${encode(attribute.value , params)}"\`);`) ;
        }
    
        codes.push(`result.push('>');`) ;
    
    }else{

        codes.push(`result.push('<${tag}>');`) ;
    }

    let childEls = el.children ;

    if(childEls.length){

        for(let childEl of childEls){
    
            generate(childEl , codes , params) ;
        }

    }else{

        let html = encode(el.innerHTML , params) ;

        if(html){

            codes.push(`result.push(\`${html}\`);`) ;
        }
    }

    codes.push(`result.push('</${tag}>')`) ;
}

const placeholderTestRe = /\{[^\{\}]+\}/,
      placeholderReplaceRe = /\{([^\{\}]+)\}/g,
      firstDataIndexRe = /^[^\.]+/;

function encode(data , params){

    data = data.replace(/\r|\n/g , '').replace(/\'/g , '\\').replace(/\"/g , '\\"').trim() ;

    if(placeholderTestRe.test(data)){

        return data.replace(placeholderReplaceRe , (match , dataIndex) =>{

            params.push(dataIndex.trim().match(firstDataIndexRe)[0]) ;

            return `$${match}` ;

        }) ;
    }
}