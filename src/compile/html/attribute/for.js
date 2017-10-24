const implement = require('./for/implemenet') ;

module.exports = el =>{

    if(el.hasAttribute('if')){

        return '' ;
    }

    return implement(el) ;
}