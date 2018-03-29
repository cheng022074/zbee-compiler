const {
    Coder
} = require('../../../coder');

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        return `
        var ${el.getAttribute('var')} = include('${el.getAttribute('name')}');
        ` ;
    }

    
    applyImports(){

        return [
            this.el.getAttribute('name')
        ] ;
    }
}