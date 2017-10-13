const request = require('request'),
      headers = {
        'Content-Type':'application/json; charset=UTF-8'
      },
      {
        get:properties_get
      } = require('./properties'),
      {
        isValid:url_valid,
        DEFAULT_API_URL
      } = require('./url');

function process_uri(uri){

    return `${url_valid(uri) ? uri : DEFAULT_API_URL}/${uri}` ;
}

exports.get = (uri , {
    query,
    path
} = {}) =>{

    return new Promise((doCallback , doError) =>{

        request({
            method:'GET',
            uri:process_uri(uri),
            qs:query,
            headers,
            json: true
        } , (error, response, body) =>{

            if(error){

                doError(error) ;
            
            }else{

                doCallback({
                    headers:response.headers,
                    body
                }) ;
            }
        }) ;

    }) ;
}

exports.delete = (uri , {
    query,
    path
} = {}) =>{

    return new Promise((doCallback , doError) =>{

        request({
            method:'DELETE',
            uri:process_uri(uri),
            qs:query,
            headers,
            json: true
        } , (error, response, body) =>{

            if(error){

                doError(error) ;
            
            }else{

                doCallback({
                    headers:response.headers,
                    body
                }) ;
            }
        }) ;

    }) ;
}

exports.post = (uri , {
    query,
    path,
    body
} = {}) =>{

    return new Promise((doCallback , doError) =>{
        
        request({
            method:'POST',
            uri:process_uri(uri),
            qs:query,
            body,
            headers,
            json: true
        } , (error, response, body) =>{

            if(error){

                doError(error) ;
            
            }else{

                doCallback({
                    headers:response.headers,
                    body
                }) ;
            }
        }) ;

    }) ;
}

exports.put = (uri , {
    query,
    path,
    body
} = {}) =>{

    return new Promise((doCallback , doError) =>{
        
        request({
            method:'PUT',
            uri:process_uri(uri),
            qs:query,
            body,
            headers,
            json: true
        } , (error, response, body) =>{

            if(error){

                doError(error) ;
            
            }else{

                doCallback({
                    headers:response.headers,
                    body
                }) ;
            }
        }) ;

    }) ;
}