const 
getDataTypes = require('../../datatypes'),
nameSplitRe = /\./,
restRe = /^\.{3}/,
defaultValueSplitRe = /\=/,
nameRe = /\w+/,
{
    match:string_match
} = require('../../../../regexp');

module.exports = class {

    constructor(meta , rawData , type){

        let me = this ;

        me.meta = meta ;

        rawData = rawData.trim() ;

        me.rest = false ;

        let match = string_match(rawData , /\[|\]/g , {
            start:'[',
            inner:true,
            end:']'
        }) ;

        if(match){

            rawData = match[0] ;

            if(restRe.test(rawData)){

                rawData = rawData.replace(restRe , '') ;

                me.rest = true ;

            }else if(defaultValueSplitRe.test(rawData)){

                let [
                    name,
                    defaultValue
                ] = rawData.split(defaultValueSplitRe) ;
    
                me.defaultValue = defaultValue.trim() ;
    
                rawData = name.trim() ;
            }

            me.optional = true ;
        
        }else{

            try{

                rawData = rawData.match(nameRe)[0] ;
            
            }catch(err){

                throw new Error(`${meta.code.fullName}::${rawData} 参数定义不合法`) ;
            }

            

            me.optional = false ;
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