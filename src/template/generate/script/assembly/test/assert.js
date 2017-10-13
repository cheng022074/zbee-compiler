const {
    apply:tempate_apply
} = require('../../../../../template'),
process_expression = require('../expression');

module.exports = (context , attrs) =>{

    let {
        type,
        actual,
        expected
    } = attrs,
    expression;

    switch(type){

        case 'length':

            expression = `assert.length(${process_expression(actual)} , ${process_expression(expected)}) ;` ;

            break ;
    }

    return tempate_apply('generate.file.script.assembly.test.assert' , {
        expression
    }) ;
}