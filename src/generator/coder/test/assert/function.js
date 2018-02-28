const {
    Coder
} = require('../../../coder') ;

module.exports = class extends Coder{

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