const {
    ContainerCoder
} = require('../coder') ;

module.exports = class extends ContainerCoder{

    getXPathForQueryItems(){

        return 'constructors|constructor|properties|methods' ;
    }

    applyCode(){

        let {
            el
        } = this ;

        return `
        class Main{
            ${super.applyCode()}
        });
        ` ;
    }
}