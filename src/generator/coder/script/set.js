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

                return `var ${el.getAttribute('name')} = include('${el.getAttribute('target')}').${el.getAttribute('property')};` ;
            
            }else{

                return `var ${el.getAttribute('name')} = include('${el.getAttribute('target')}');` ;
            }   
        }

        return '' ;
    }

    
    applyImports(){

        return [
            this.el.getAttribute('target')
        ] ;
    }
}