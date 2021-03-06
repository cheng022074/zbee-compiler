const {
    Coder
} = require('../../coder'),
{
    expression
} = require('../../../script/generator');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        if(el.hasAttribute('value')){

            return `var ${el.getAttribute('name')} = ${expression(el.getAttribute('value'))};` ;
        
        }else if(el.hasAttribute('target')){

            if(el.hasAttribute('property')){

                return `var ${el.getAttribute('name')} = ${el.getAttribute('target')}.${el.getAttribute('property')};` ;
            
            }else{

                return `var ${el.getAttribute('name')} = include('${el.getAttribute('target')}');` ;
            }

        }else if(el.hasAttribute('resource')){

            return `var ${el.getAttribute('name')} = require('path').join(process.env['ZBEE-APP-PATH'] , '${el.getAttribute('resource')}');`
        }

        return '' ;
    }

    
    applyImports(){

        return [
            this.el.getAttribute('target')
        ] ;
    }
}