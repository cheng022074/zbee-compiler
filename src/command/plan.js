const {
    SourceCode
} = require('../code'),
generate = require('./generate');

module.exports = name =>{

    let code = SourceCode.get(name),
        classes = code.dependentClasses,
        names = Object.keys(classes);

    for(let name of names){

        generate(name , classes[name]) ;
    }
}