const {
    ContainerCoder
} = require('../../coder') ;

module.exports = class extends ContainerCoder{

    getXPathForQueryItems(){

        return 'describe|before|after' ;
    }

    applyCode(){

        let {
            el
        } = this ;

        return `
        describe('${el.getAttribute('name')}' , () =>{
            ${super.applyCode()}
        });
        ` ;
    }
}