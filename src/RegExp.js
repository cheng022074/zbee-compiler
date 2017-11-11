/**
 * 
 * 基于正则表达式应用的扩展实现
 * 
 */

 const {
     from
 } = require('./array') ;

 exports.removeBorders = (data , borderRe) =>{

    return data.replace(borderRe , (match , value) => value) ;
 }

 exports.groupMatch = (data , {
     regexp,
     region,
     border = true
 }) =>{

    let match,
        targets = [],
        lastTarget,
        result = [];

    while(match = regexp.exec(data)){

        let tag = match[0].trim(),
            {
                index,
            } = match,
            {
                start:startTag,
                end:endTag
            } = region;

        if(tag === startTag){

            let target = {
                index,
                tag
            } ;

            targets.push(target),
            lastTarget = target;
        
        }else if(tag === endTag && lastTarget.tag === startTag){

            targets.pop() ;

            if(border === true){

                result.push(data.substring(lastTarget.index , index + match[0].length)) ;
            
            }else{

                result.push(data.substring(lastTarget.index + 1 , index +  match[0].length - 1)) ;
            }

            lastTarget = targets[targets.length - 1] ;
        }
    }
    
    return result ;
 }

 exports.genreatePlaceholderString = (data , placeholderRe , placeholderFn) =>{

    let values = {} ;
    
    data = data.replace(placeholderRe , match =>{

        return values[placeholderFn(match)] = match ;

    }) ;

    return {
        data,
        values
    } ;
    
 }

 exports.restorePlaceholderString = (data , placeholderData) =>{

    let keys = Object.keys(placeholderData) ;

    const replaceFn = key =>{

        return placeholderData[key] ;
    } ;

    for(let key of keys){

        data = data.replace(key , replaceFn) ;
    }

    return data ;

 }