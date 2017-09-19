const is_empty = require('../is/empty'),
      is_string = require('../is/string');

module.exports = (data) =>{

    if(is_empty(data)){

        return [];
    }

    if (data && data.length !== undefined && !is_string(data)) {

        return Array.from(data);

    }

    return [
        data
    ];
};