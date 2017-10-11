const request = require('request-promise'),
      headers = {
        'Content-Type':'application/json; charset=UTF-8'
      },
      {
        get:properties_get
      } = require('./properties'),
      {
        isValid:url_valid
      } = require('./url');

function process_uri(uri){

    return `${url_valid(uri) ? uri : properties_get('web.api.domain')}/${uri}` ;
}

exports.get = (uri , {
    query,
    path
} = {}) =>{

    return request({
        uri:process_uri(uri),
        qs:query,
        headers,
        json: true
    }) ;
}

exports.delete = (uri , {
    query,
    path
} = {}) =>{

    return request({
        method:'DELETE',
        uri:process_uri(uri),
        qs:query,
        headers,
        json: true
    }) ;
}

exports.post = (uri , {
    query,
    path,
    body
} = {}) =>{

    return request({
        method:'POST',
        uri:process_uri(uri),
        qs:query,
        body,
        headers,
        json: true
    }) ;
}

exports.put = (uri , {
    query,
    path,
    body
} = {}) =>{

    return request({
        method:'PUT',
        uri:process_uri(uri),
        qs:query,
        body,
        headers,
        json: true
    }) ;
}