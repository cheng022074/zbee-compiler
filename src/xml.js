const {
    parse
} = require('elementtree') ;

exports.parse = data =>{

    return parse(data) ;
}

exports.stringify = data =>{

    return data.write();
}

exports.format = data =>{

    
}