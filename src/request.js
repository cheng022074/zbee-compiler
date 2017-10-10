const request = require('request-promise'),
      headers = {
        'Content-Type':'application/json; charset=UTF-8'
      };

exports.get = (uri , {
    query,
    path
} = {}) =>{

    return request({
        uri:uri,
        qs:query,
        headers,
        json: true
    }) ;
}

exports.delete = (url , {
    query,
    path
} = {}) =>{

    return request({
        method:'DELETE',
        uri:uri,
        qs:query,
        headers,
        json: true
    }) ;
}

exports.post = (url , {
    query,
    path,
    body
} = {}) =>{

    return request({
        method:'POST',
        uri:uri,
        qs:query,
        body,
        headers,
        json: true
    }) ;
}

exports.put = (url , {
    query,
    path,
    body
} = {}) =>{

    return request({
        method:'PUT',
        uri:uri,
        qs:query,
        body,
        headers,
        json: true
    }) ;
}