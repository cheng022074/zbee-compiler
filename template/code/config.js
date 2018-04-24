(name , key) =>{

    let target = include(`config::${name}`) ;
    
    if(!target){

        return ;
    }

    if(key){

        return include('object.get')(target , key) ;
    }

    return target ; 
}