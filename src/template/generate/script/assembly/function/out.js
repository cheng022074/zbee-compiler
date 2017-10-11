const {
    apply:apply
} = require('../../../../../template'),
process_expression = require('../expression');

module.exports = attrs =>{

    let expression = '';

    if(attrs.hasOwnProperty('value')){

        expression = process_expression(attrs.value) ;
    }

    return apply('generate.file.script.assembly.out' , {
        expression
    }) ;
}