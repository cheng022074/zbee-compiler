(() =>{

    return (name , fn , scope) =>{

        if(typeof name === 'string' && typeof fn === 'function'){

            if(scope){

                fn = scope.bind(scope) ;
            }
    
            exports[name] = fn ;
        }
    } ;

})()