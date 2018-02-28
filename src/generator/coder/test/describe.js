const {
    ContainerCoder
} = require('../../coder') ;

class Describe extends ContainerCoder{

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