(name , key) =>{

    let target = include(`config::${name}`) ;
    
    if(!target){

        return ;
    }

    if(key){

        if(target.hasOwnProperty(key)){
    
            return target[key] ;
        }
    
        let names = key.split(/\./),
            prefix = '';
    
        for(let name of names){
    
            let key = `${prefix}${name}` ;
    
            if(target.hasOwnProperty(key)){
    
                target = target[key] ;
    
                prefix = '' ;
            
            }else{
    
                prefix = `${key}.` ;
            }
        }
    
        if(prefix){
    
            return ;
        }
    }

    return target ; 
}