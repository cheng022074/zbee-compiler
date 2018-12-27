(name , fn) =>{

    if(typeof name === 'string' && typeof fn === 'fucntion'){

        exports[name] = fn ;
    }
}