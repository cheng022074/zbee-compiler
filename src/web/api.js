const request = require('../request') ;

exports.input = (uri , method , options) =>{

    if(!request.hasOwnProperty(method)){

        method = 'get' ;
    }

    return request[method](uri , options) ;
}

exports.output = () =>{


}