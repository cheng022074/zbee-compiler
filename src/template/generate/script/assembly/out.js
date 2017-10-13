const {
    apply:apply
} = require('../../../../template'),
{
    toBoolean
} = require('../../../../string'),
process_expression = require('./expression');

module.exports = (context , attrs) =>{

    let expression = '';

    if(attrs.hasOwnProperty('value')){

        expression = process_expression(attrs.value) ;
    }

    return apply('generate.file.script.assembly.out' , {
        expression,
        json_format:toBoolean(attrs['json-format'])
    }) ;
}