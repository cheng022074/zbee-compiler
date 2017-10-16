exports.capitalize = data =>{

    return `${data.charAt(0).toUpperCase()}${data.substr(1)}` ;
}

const intRe = /^\d+$/ ;

exports.toInt = data =>{

    if(intRe.test(data)){

        return parseInt(data) ;
    }
}

const floatRe = /^\d+(?:\.\d+)?$/ ;

exports.toFloat = data =>{

    if(floatRe.test(data)){

        return parseFloat(data) ;
    }
}

const dateRe = /^\d{4}\-\d{2}\-\d{2}(?:\s\d{2}\:\d{2}(?:\:\d{2}))?$/ ;

exports.toDate = data =>{

    if(dateRe.test(data)){

        return new Date(data) ;
    }
}

exports.toTimestamp = data =>{

    let date = exports.toDate(data) ;

    if(date){

        return date.getTime() ;
    }
}

const booleanRe = /^true|false$/,
      {
          empty:is_empty,
          defined:is_defined
      } = require('./is');

exports.toBoolean = data =>{

    if(booleanRe.test(data)){

        return data === 'true' ;
    }
}

exports.toString = data =>{

    return data ;
}

exports.toLiteral = data =>{

    if(intRe.test(data) || floatRe.test(data) || booleanRe.test(data)){

        return data ;
    }
    
    try{

        return JSON.parse(data) ;
    
    }catch(err){

    }

    return `'${data}'` ;
}