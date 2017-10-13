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
      } = require('./url'),
      {
          coverMerge:object_merge
      } = require('./object');

function process_uri(uri){

    return `${url_valid(uri) ? uri : DEFAULT_API_URL}/${uri}` ;
}

function process_headers(header){

    if(header){

        return object_merge(headers , header) ;
    }

    return headers ;
}

exports.get = (uri , {
    query,
    path,
    header
} = {}) =>{

    return new Promise((doCallback , doError) =>{

        request({
            method:'GET',
            uri:process_uri(uri),
            qs:query,
            headers:process_headers(header),
            json: true
        } , (error, response, body) =>{

            if(error){

                doError(error) ;
            
            }else{

                doCallback({
                    header:response.headers,
                    body
                }) ;
            }
        }) ;

    }) ;
}

exports.delete = (uri , {
    query,
    path,
    header
} = {}) =>{

    return new Promise((doCallback , doError) =>{

        request({
            method:'DELETE',
            uri:process_uri(uri),
            qs:query,
            headers:process_headers(header),
            json: true
        } , (error, response, body) =>{

            if(error){

                doError(error) ;
            
            }else{

                doCallback({
                    header:response.headers,
                    body
                }) ;
            }
        }) ;

    }) ;
}

exports.post = (uri , {
    query,
    header,
    path,
    body
} = {}) =>{

    return new Promise((doCallback , doError) =>{
        
        request({
            method:'POST',
            uri:process_uri(uri),
            qs:query,
            body,
            headers:process_headers(header),
            json: true
        } , (error, response, body) =>{

            if(error){

                doError(error) ;
            
            }else{

                doCallback({
                    header:response.headers,
                    body
                }) ;
            }
        }) ;

    }) ;
}

exports.put = (uri , {
    query,
    header,
    path,
    body
} = {}) =>{

    return new Promise((doCallback , doError) =>{
        
        request({
            method:'PUT',
            uri:process_uri(uri),
            qs:query,
            body,
            headers:process_headers(header),
            json: true
        } , (error, response, body) =>{

            if(error){

                doError(error) ;
            
            }else{

                doCallback({
                    header:response.headers,
                    body
                }) ;
            }
        }) ;

    }) ;
}