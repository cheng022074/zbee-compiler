module.exports = doc =>{

    return {
        code:generate(doc.documentElement).join('\n')
    } ;
}

function generate(el , codes = []){

    let tag = el.tagName.toLowerCase() ;

    let attributes = Array.from(el.attributes) ;

    if(attributes.length){

        codes.push(`result.push('<${tag}');`) ;
        
        for(let attribute of attributes){
    
            codes.push(`result.push(' ${attribute.name} = "${encode(attribute.value)}"');`) ;
        }
    
        codes.push(`result.push('>')`) ;
    
    }else{

        codes.push(`result.push('<${tag}>');`) ;
    }

    let childEls = el.children ;

    if(childEls.length){

        for(let childEl of childEls){
    
            generate(childEl , codes) ;
        }

    }else{

        let html = encode(el.innerHTML) ;

        if(html){

            codes.push(`result.push('${html}');`) ;
        }
    }

    codes.push(`result.push('</${tag}>')`) ;

    return codes ;
}

function encode(data){

    return data.replace(/\r|\n/g , '').replace(/\'/g , '\\').replace(/\"/g , '\\"') ;
}