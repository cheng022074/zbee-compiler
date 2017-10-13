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

        case 'equal':

            {
                let {
                    strict
                } = attrs ;
    
                let method ;
    
                if(strict === 'true'){
    
                    method = 'deepStrictEqual' ;
                
                }else{
    
                    method = 'deepEqual' ;
                }
    
                expression = `assert.${method}(${process_expression(actual)} , ${process_expression(expected)}) ;` ;
            }
        
            break ;

        case 'recordset-equal':

            {
                let {
                    strict
                } = attrs ;

                let method ;

                if(strict === 'true'){

                    method = 'strictRecordsetEqual' ;
                
                }else{

                    method = 'recordsetEqual' ;
                }

                expression = `assert.${method}(${process_expression(actual)} , ${process_expression(expected)}) ;` ;
            
            }
            
            break ;
    }   

    return tempate_apply('generate.file.script.assembly.test.assert' , {
        expression
    }) ;
}