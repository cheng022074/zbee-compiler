module.exports = (fn , scope) => {
    
    if(scope){

        return fn.bind(scope) ;
    }

    return fn ;
}