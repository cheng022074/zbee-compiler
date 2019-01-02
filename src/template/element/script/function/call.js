const 
ScriptElement = require('../../script'),
ParamSet = require('./param/with/set') ;

class CallFunctionElement extends ScriptElement{

    constructor(tag){

        super(tag) ;

        this.params = new ParamSet(this.queryAll('with-param')) ;
    }

    render(){

        let me = this ;

        if(me.hasAttribute('name')){

            return `await include('${me.getAttribute('name')}')(${me.params.toString()});` ;
        }

        throw new Error('缺少执行函数名称') ;
    }

}

module.exports = () =>{

    return CallFunctionElement ;
} ;