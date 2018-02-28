const {
    ContainerCoder
} = require('../../coder') ;

module.exports = class extends ContainerCoder{

    applyCode(){

        let {
            el
        } = this ;

        return `
        describe('${el.getAttribute('name')}' , function(){
            ${super.applyCode()}
        });
        ` ;
    }
}