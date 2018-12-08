const {
    parse,
    stringify
} = require('../../script'),
{
    traverse,
} = require('estraverse'),
{
    defineProperties
} = require('../../object');

module.exports = class {

    constructor(data){

        let me = this ;

        me.codStr = data ;

        me.data = parse(`async() =>{${data}}`) ;

        defineProperties(me , [
            'hasMain',
            'isAsync'
        ]) ;
    }

    toString(){

        return stringify(this.innerData) ;
    }

    get innerData(){

        return this.data.body[0].expression.body.body ;
    }

    getHasMain(){

        let {
            innerData
        } = this ;

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

        let {
            hasMain,
            data,
            innerData
        } = this ;

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