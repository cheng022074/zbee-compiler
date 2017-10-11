const request = require('request-promise'),
      headers = {
        'Content-Type':'application/json; charset=UTF-8'
      };

exports.get = (uri , {
    query,
    path
} = {}) =>{

    return request({
        uri,
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
        uri,
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
        uri,
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
        uri,
        qs:query,
        body,
        headers,
        json: true
    }) ;
}