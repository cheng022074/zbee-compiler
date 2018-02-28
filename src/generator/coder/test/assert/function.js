const {
    Coder
} = require('../../../coder') ;

module.exports = class extends Coder{

    applyCode(){

        let {
            el
        } = this ;

        return `
        include('${el.getAttribute('name')}')();
        ` ;
    }
}