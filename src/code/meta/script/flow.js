const
FunctionMeta = require('./function')(),
XML = require('../../../xml'),
template_build = require('../../../template/build/xml');

class FlowMeta extends FunctionMeta{

    getRawBody(){

        return template_build(XML.parse(super.getRawBody()).documentElement , 'template.element.script') ;
    }
}

module.exports = function(code){

    if(arguments.length){

        return new FlowMeta(code) ;
    }

    return FlowMeta ;
}