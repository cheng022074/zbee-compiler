const {
    ContainerCoder
} = require('../../coder') ;

module.exports = class extends ContainerCoder{

    applyCode(){

        let {
            el
        } = this ;

        return `
        it('${el.getAttribute('name')}' , function(){
            ${super.applyCode()}
        });
        ` ;
    }
}