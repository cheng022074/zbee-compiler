(name , key) =>{

    let fullName = `config::${name}`,
        target = include(fullName) ;

    if(!target && exports.hasOwnProperty('include')){

        target = exports.include(fullName) ;
    }

    if(key){

        return include('object.get')(target , key) ;
    }

    return target ; 
}