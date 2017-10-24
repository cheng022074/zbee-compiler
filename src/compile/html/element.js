module.exports = el =>{

    let tag = el.tagName.toLowerCase(),
        result = [];

    result.push(`<${tag}`) ;

    let attrs = el.attributes ;

    for(let attr of attrs){

        result.push() ;
    }

    result.push('>') ;

    result.push(`</${tag}>`) ;
}