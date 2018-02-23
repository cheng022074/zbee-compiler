function is_type(data , type){

    return typeof data === type ;
}

{
    const classRe = /^class/ ;

    exports.function = data =>{

        return is_type(data , 'function') && !classRe.test(data.toString());
    }
}

exports.simpleObject = data =>{

    return data instanceof Object && data.constructor === Object;
}