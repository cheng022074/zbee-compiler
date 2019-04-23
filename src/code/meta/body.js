const {
    parse,
    traverse
} = require('../../script'),
{
    defineProperties
} = require('../../object');

function getMain(){

    let
    me = this,
    {
        body:items
    } = me.data.program;

    for(let item of items){

        let {
            id,
            type
        } = item ;

        if(id){

            let {
                name
            } = id ;

            if(name === 'main' && (type === 'FunctionDeclaration' || type === 'ClassDeclaration')){
        
                return item ;
            }
        }
    }
}

module.exports = class {

    constructor(meta){

        let me = this,
            data = meta.rawBody;

        me.meta = meta ;

        me.data = parse(data) ;

        me.rawData = data ;

        defineProperties(me , [
            'hasMain',
            'isMainClass',
            'isAsync'
        ]) ;

        me.$main = getMain.call(me) ;
    }

    toString(){

        return this.rawData ;
    }

    getIsMainClass(){

        let {
            $main:main
        } = this ;

        if(main){

            let {
                type
            } = main ;

            return type === 'ClassDeclaration' ;
        }

        return false ;
    }

    getHasMain(){

        return !!this.$main ;
    }

    getIsAsync(){

        let
        me = this,
        {
            $main:main,
            data
        } = me ;

        if(main){

            let {
                async,
                type
            } = main ;

            if(type === 'FunctionDeclaration'){

                return async ;
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