const {
    parse,
    stringify
} = require('../../script'),
{
    traverse,
} = require('estraverse'),
{
    defineProperties
} = require('../../object'),
scopedRe = /@scoped/,
asyncRe = /@async/;

module.exports = class {

    constructor(meta){

        let me = this,
            data = meta.rawBody;

        me.meta = meta ;

        try{

            me.data = parse(`async() =>{${data}}`) ;
        
        }catch(err){

            me.data = false ;
        }

        me.rawData = data ;

        defineProperties(me , [
            'hasMain',
            'isAsync'
        ]) ;
    }

    toString(){

        let me = this ;

        if(me.data === false){

            return me.rawData ;
        }

        return stringify(me.innerData) ;
    }

    get innerData(){

        return this.data.body[0].expression.body.body ;
    }

    getHasMain(){

        let
        me = this;

        if(me.data === false){

            if(scopedRe.test(me.meta.header)){

                return true ;
            }

            return false ;
        }

        let {
            innerData
        } = me ;

        for(let {
            type,
            id
        } of innerData){

            if(id){

                let {
                    name
                } = id ;

                if(name === 'main' && type === 'FunctionDeclaration'){
            
                    return true ;
                }
            }
        }
    
        return false ;
    }

    getIsAsync(){

        let
        me = this;

        if(me.data === false){

            if(asyncRe.test(me.meta.header)){

                return true ;
            }

            return false ;
        }

        let {
            hasMain,
            data,
            innerData
        } = me ;

        if(hasMain){

            for(let {
                type,
                async:isAsync,
                id
            } of innerData){

                if(id){

                    let {
                        name
                    } = id ;
            
                    if(name === 'main' && type === 'FunctionDeclaration'){
            
                        return isAsync ;
                    }
                }
            }

            return false ;

        }

        let result = false,
            locked = true;

        traverse(data , {

            enter({
                type
            }){

                let me = this ;

                switch(type){

                    case 'ArrowFunctionExpression':

                        if(locked){

                            locked = false ;

                            break ;
                        }

                    case 'FunctionDeclaration':
                    case 'FunctionExpression':
                    case 'ClassDeclaration':
                    case 'ClassExpression':

                        me.skip() ;

                        break ;

                    case 'AwaitExpression':

                        me.break() ;

                        result = true ;
                }
            }

        }) ;

        return result ;
    }

} ;