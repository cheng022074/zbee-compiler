exports.load = path =>{

    try{

        return require(path) ;
    
    }catch(err){

        if(err.message.indexOf('Cannot find module') === 0){
                    
            return {};
    
        }

        throw err ;
    }
}