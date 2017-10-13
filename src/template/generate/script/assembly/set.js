const {
    variableName:var_valid
} = require('../../../../valid'),
process_expression = require('./expression');

module.exports = (context , attrs , node) =>{

    let {
        var:varName,
        scope,
        value,
        target,
        property
    } = attrs ;

    if(!varName || !var_valid(varName)){

        throw new Error(` ${varName} 不是一个合法的变量名称`) ;
    }

    let prefix ;

    if(scope === 'module'){

        context.params.push(varName) ;

        prefix = '' ;
    
    }else{

        prefix = 'var ' ;
    }

    let valueExpression ;

    if(value){

        valueExpression = process_expression(value) ;
    
    }else if(target){

        if(property){

            valueExpression = `require('object').get(${target} , '${property}')` ;

        }else{

            valueExpression = target ;
        }
    }

    if(valueExpression){

        return `${prefix}${varName}=${valueExpression};` ;
    }
}