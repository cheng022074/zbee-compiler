const 
scss = require('../scss'),
varRe = /^\$/,
defaultRe = /!default$/;

module.exports = class extends scss{

    getCode(data){

        let result = [],
            fullName = this.getFullName();

        data.walkDecls(decl => {

            let {
                prop,
                value
            } = decl ;

            decl.prop = prop.replace(varRe , `$${fullName}-`) ;

            if(!defaultRe.test(value)){

                decl.value = `${value} !default` ;
            }

            result.push(`${decl.toString()};`) ;

        }) ;

        return result.join('\n') ;
    }
}