const {
    defineCacheProperties
} = require('../../../../object'),
getDataTypes = require('../datatypes'),
nameSplitRe = /\./,
defaultValueSplitRe = /\=/,
{
    match:string_match
} = require('../../../../regexp');

module.exports = class {

    constructor(rawData , type){

        let me = this ;

        rawData = rawData.trim() ;

        let match = string_match(rawData , /\[|\]/g , {
            start:'[',
            inner:true,
            end:']'
        }) ;

        if(match){

            rawData = match[0] ;

            me.optional = true ;
        
        }else{

            me.optional = false ;
        }

        if(defaultValueSplitRe.test(rawData)){

            let [
                name,
                defaultValue
            ] = rawData.split(defaultValueSplitRe) ;

            me.defaultValue = defaultValue ;

            rawData = name ;
        }

        if(nameSplitRe.test(rawData)){

            let [
                parentParamName,
                name
            ] = rawData.split(nameSplitRe) ;

            me.parentParamName = parentParamName ;

            me.name = name ;
        
        }else{

            me.name = rawData ;
        }

        me.types = getDataTypes(type);

        me.items = [] ;
    }

    get type(){

        return this.types[0] ;
    }

    add(param){

        let {
            type
        } = this ;

        switch(type){

            case 'object':
            case 'array':

                me.items.push(param) ;
        }
    }

} ;