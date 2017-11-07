/**
 * 
 * 基于正则表达式应用的扩展实现
 * 
 */

 const {
     from
 } = require('./array') ;

 exports.groupMatch = (data , {
     regexp,
     region,
     border = true,
     multi = true
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

            if(multi === false){

                return result[0] ;
            }

            lastTarget = targets[targets.length - 1] ;
        }
    }

    if(multi === false){

        if(result.length){

            return result[0] ;
        }

        return ;
    }
    
    return result ;
 }