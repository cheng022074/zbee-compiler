(name , key) =>{

    return include(`config::${name}`)(key) ;

}