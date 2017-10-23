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
    
            codes.push(`result.push(' ${attribute.name} = "${attribute.value.replace(/\r|\n/g , '')}"');`) ;
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

        let html = el.innerHTML ;

        if(html){

            codes.push(`result.push('${html}');`) ;
        }
    }

    codes.push(`result.push('</${tag}>')`) ;

    return codes ;
}