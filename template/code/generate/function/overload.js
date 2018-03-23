let argumentTypes = [],
    values = Array.from(arguments);

for(let value of values){

    argumentTypes.push(gettype(value)) ;
}

let argumentLen = argumentTypes.length,
    functions = <%- JSON.stringify(data.functions) %>,
    me = this;

for(let {
    implement,
    paramTypes
} of functions){

    if(argumentLen === paramTypes.length){

        let isThis = true ;

        for(let i = 0 ; i < argumentLen ; i ++){

            if(paramTypes[i] !== argumentTypes[i]){

                isThis = false ;

                break ;
            }
        }

        if(isThis){

            return include(implement)(me , ...values) ;
        }
    }
}

throw new ReferenceError('参数类型或者数量不匹配') ;


