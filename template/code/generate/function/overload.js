let argumentTypes = [],
    values = Array.from(arguments);

for(let value of values){

    argumentTypes.push(gettype(value)) ;
}

let functions = <%- JSON.stringify(data.functions) %>,
    me = this;

for(let {
    implement,
    paramTypes
} of functions){

    if(len === paramTypes.length){

        let isThis = true ;

        for(let i = 0 ; i < len ; i ++){

            if(paramTypes[i] !== argumentTypes[i]){

                isThis = false ;

                break ;
            }
        }

        if(isThis){

            include(implement)(me , ...values) ;

            break ;
        }
    }
}