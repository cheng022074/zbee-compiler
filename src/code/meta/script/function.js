const 
ScriptMeta = require('../script'),
Param = require('./function/param'),
returnTypeRe = /@return\s+\{([^\{\}]+)\}/,
getDataTypes = require('../datatypes');

class FunctionMeta extends ScriptMeta{

    getReturnTypes(){

        let {
            body
        } = this ;

        let result = body.match(returnTypeRe) ;

        if(result){

            return getDataTypes(result[1]) ;
        }

        return super.applyReturnTypes() ;
    }

    getParams(){

        let 
        {
            body
        } = this,
        textCodeMetaParamRe = /@param\s+\{([^\{\}]+)\}\s+([^\n\r]+)/g,
        result = [],
        match,
        params = {};

        while(match = textCodeMetaParamRe.exec(body)){

            let [
                ,
                type,
                rawData
            ] = match,
            param = new Param(rawData , type),
            {
                name,
                parentParamName
            } = param;

            if(parentParamName && params.hasOwnProperty(parentParamName)){

                params[parentParamName].add(param) ;
            
            }else{

                params[name] = param ;

                result.push(param) ;
            }
        }

        return result ;
    }
}

module.exports = code =>{

    return new FunctionMeta(code) ;
}