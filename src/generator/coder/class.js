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

        if(el.getAttribute('singleton') === 'yes'){

            return `
            const Main = new class{
                ${super.applyCode()}
            };
            ` ;
        }

        return `
        class Main{
            ${super.applyCode()}
        };
        ` ;
    }
}