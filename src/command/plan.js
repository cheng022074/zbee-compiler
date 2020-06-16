const {
    SourceCode
} = require('../code'),
generate = require('./generate');

module.exports = (name , planedNames = []) =>{

    if(planedNames.includes(name)){

        return ;
    }

    planedNames.push(name) ;

    let code = SourceCode.get(name) ;

    if(code.exists){

        let classes = code.dependentClasses,
            names = Object.keys(classes);

        for(let name of names){

            generate(name , classes[name] , planedNames) ;
        }
    }

    
}