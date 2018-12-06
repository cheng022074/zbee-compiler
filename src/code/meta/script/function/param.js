const {
    defineCacheProperties
} = require('../../../../object'),
getDataTypes = require('../../datatypes'),
nameSplitRe = /\./,
defaultValueSplitRe = /\=/,
nameRe = /\w+/,
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

            rawData = rawData.match(nameRe)[0] ;

            me.optional = false ;
        }

        if(defaultValueSplitRe.test(rawData)){

            let [
                name,
                defaultValue
            ] = rawData.split(defaultValueSplitRe) ;

            me.defaultValue = defaultValue.trim() ;

            rawData = name.trim() ;
        }

        if(nameSplitRe.test(rawData)){

            let [
                parentParamName,
                name
            ] = rawData.split(nameSplitRe) ;

            me.parentParamName = parentParamName.trim() ;

            me.name = name.trim() ;
        
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
            type,
            items
        } = this ;

        switch(type){

            case 'object':
            case 'array':

                items.push(param) ;
        }
    }

} ;