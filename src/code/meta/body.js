const {
    parse,
    traverse
} = require('../../script'),
{
    defineProperties
} = require('../../object');

module.exports = class {

    constructor(meta){

        let me = this,
            data = meta.rawBody;

        me.meta = meta ;

        me.data = parse(data) ;

        me.rawData = data ;

        defineProperties(me , [
            'hasMain',
            'isAsync'
        ]) ;
    }

    toString(){

        return this.rawData ;
    }


    getHasMain(){

        let
        me = this,
        {
            data
        } = me;

        data = data.program.body ;

        for(let {
            type,
            id
        } of data){

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
        me = this,
        {
            hasMain,
            data
        } = me ;

        if(hasMain){

            data = data.program.body ;

            for(let {
                type,
                async:isAsync,
                id
            } of data){

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

        let result = false;

        traverse(data , {

            enter(path){

                let {
                    type
                } = path ;

                switch(type){

                    case 'ArrowFunctionExpression':
                    case 'FunctionDeclaration':
                    case 'FunctionExpression':
                    case 'ClassDeclaration':
                    case 'ClassExpression':

                        path.skip() ;

                        break ;

                    case 'AwaitExpression':

                        path.stop() ;

                        result = true ;
                }
            }

        }) ;

        return result ;
    }

} ;