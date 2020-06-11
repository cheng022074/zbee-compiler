module.exports = (fn , {
    scope,
    buffer = 0
} = {}) => {

    let bufferId ;

    return () =>{

        if(bufferId){

            clearTimeout(bufferId) ;
        }

        bufferId = setTimeout(() => {

            get(fn , scope)() ;

            bufferId = null ;

        } , buffer) ;
    } ;
}