(() =>{

    const typeofTypes = [
        'number',
        'string',
        'boolean',
        'undefined',
        'function'
     ],
     {
        toString
     } = Object.prototype,
     toStringTypes = {
        '[object Array]'  : 'array',
        '[object Date]'   : 'date',
        '[object Boolean]': 'boolean',
        '[object Number]' : 'number',
        '[object RegExp]' : 'regexp'
    },
    nonWhitespaceRe = /\S/;

    return data =>{

        if(data === null){

            return 'null' ;
        }
        
        let type = typeof data ;
    
        if(typeofTypes.includes(type)){
    
            return type ;
        }
    
        let ret = toStringTypes[toString.call(data)] ;
    
        if(ret){
    
            return ret ;
        }
    
        if (type === 'object'){
    
            if (data.nodeType !== undefined){
    
                if (data.nodeType === 3){
    
                    return nonWhitespaceRe.test(data.nodeValue) ? 'textnode' : 'whitespace';
    
                }else{
    
                    return 'element';
                }
            }
    
            return 'object';
        }
    
        return 'mixed' ;

    } ;

})()