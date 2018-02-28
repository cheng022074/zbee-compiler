const {
    ContainerCoder
} = require('../../coder') ;

module.exports = class extends ContainerCoder{

    applyCode(){

        let {
            el
        } = this ;

        return `
        describle('${el.getAttribute('name')}' , function(){
            ${super.applyCode()}
        });
        ` ;
    }
}