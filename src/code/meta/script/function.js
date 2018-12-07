const 
ScriptMeta = require('../script'),
Param = require('./function/param'),
returnTypeRe = /@return\s+\{([^\{\}]+)\}/,
getDataTypes = require('../datatypes');

class FunctionMeta extends ScriptMeta{

    getReturnTypes(){

        let {
            header
        } = this ;

        let result = header.match(returnTypeRe) ;

        if(result){

            return getDataTypes(result[1]) ;
        }

        return super.applyReturnTypes() ;
    }

    getParams(){

        let 
        {
            header
        } = this,
        textCodeMetaParamRe = /@param\s+\{([^\{\}]+)\}\s+([^\n\r]+)/g,
        result = [],
        match,
        params = {};

        while(match = textCodeMetaParamRe.exec(header)){

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