const request = require('../request') ;

exports.input = (uri , method , options) =>{

    console.log(uri) ;

    if(!request.hasOwnProperty(method)){

        method = 'get' ;
    }

    return request[method](uri , options) ;
}

exports.output = () =>{


}