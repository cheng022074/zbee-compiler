const {
    empty:is_empty,
    string:is_string
} = require('./is') ;

exports.from = data =>{

    if(is_empty(data)){

        return [];
    }

    if (data && data.length !== undefined && !is_string(data)) {

        return Array.from(data);

    }

    return [
        data
    ];
}