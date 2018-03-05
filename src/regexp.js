const {
    from
} = require('./array') ;

exports.range = (data , reg , tags) =>{

    tags = from(tags) ;

    let startTags = [],
        startTagLength,
        match;

    while(match = reg.exec(data)){

        let [
            tag
        ] = match,
        {
            index
        } = match ;

        if(includes(tags , 'start' , tag)){

            startTags.push({
                tag,
                index
            }) ;
            
        }else if(includes(tags , 'end' , tag) && (startTagLength = startTags.length)){

            let {
                tag:startTag,
                index:startIndex
            } = startTags[startTagLength - 1] ;

            if(exists(tags , startTag , tag)){

                startTags.pop() ;

                if(startTags.length === 0){

                    return data.substr(startIndex , index + tag.length) ;
                }

            }
        }
    }

    return false ;
}

function includes(tags , key , value){

    for(let tag of tags){

        if(tag[key] === value){

            return true ;
        }
    }

    return false ;
}

function exists(tags , startTagName , endTagName){

    for(let {
        start,
        end
    } of tags){

        if(start === startTagName && end === endTagName){

            return true ;
        }
    }

    return false ;
}