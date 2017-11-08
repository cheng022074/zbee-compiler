const {
    from,
    unique
} = require('../../array'),
application = require('../../application');

module.exports = names =>{
    
    names = from(names) ;

    let codes = [] ;
    
    for(let name of names){

        let configs = application.parseSourceCodeNames(name) ;

        for(let config of configs){

            let code = application.getSourceCode(config);

            if(code){

                codes.push(...code.importAllSourceCodes) ;
                
                codes.push(code) ;
            }
        }
    }

    return unique(codes);
}