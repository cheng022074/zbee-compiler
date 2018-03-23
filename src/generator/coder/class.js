const {
    ContainerCoder
} = require('../coder') ;

module.exports = class extends ContainerCoder{

    getXPathForQueryItems(){

        return 'constructor|constructors|properties|methods' ;
    }

    applyCode(){

        let {
            el
        } = this ;

        if(el.hasAttribute('extend')){

            return `
            class Main extends include('${el.getAttribute('extend')}'){
                ${super.applyCode()}
            };
            ` ;
        
        }else{

            return `
            class Main{
                ${super.applyCode()}
            };
            ` ;
        }
    }

    getImports(){

        let {
            el
        } = this ;

        if(el.hasAttribute('extend')){

            return [
                el.getAttribute('extend')
            ] ;
        }

        return [];
    }
}