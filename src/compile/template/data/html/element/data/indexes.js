const placeholderTestRe = /\{[^\{\}]+\}/;

module.exports = el =>{

    let attrs = el.attributes ;

    for(let attr of attrs){

        
    }
    
    if(placeholderTestRe.test(data)){

        return data.replace(placeholderReplaceRe , (match , dataIndex) =>{

            params.push(dataIndex.trim().match(firstDataIndexRe)[0]) ;

            return `$${match}` ;

        }) ;
    }
}