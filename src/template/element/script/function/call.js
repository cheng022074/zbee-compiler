const 
ScriptElement = require('../../script'),
ParamSet = require('./param/with/set'),
{
    defineProperty
} = require('../../../../object');

class CallFunctionElement extends ScriptElement{

    constructor(tag){

        super(tag) ;

        defineProperty(this , 'params') ;
    }

    getParams(){

        return new ParamSet(this.queryAll('with-param')) ;
    }

    valid(){

        if(!this.hasAttribute('name')){

            throw new Error('缺少执行函数名称') ;
        }
    }

    getImportNames(){

        let me = this ;

        me.valid() ;

        return [
            me.getAttribute('name')
        ] ;
    }

    render(){

        let me = this ;

        me.valid() ;

        return `await include('${me.getAttribute('name')}')(${me.params.toString()});` ;
       
    }

}

module.exports = () =>{

    return CallFunctionElement ;
} ;