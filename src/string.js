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

exports.toString = data =>{

    return data ;
}