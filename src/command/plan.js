const
Meta = require('../../lib/code/bin/meta'),
getFullName = require('../../lib/name/full'),
compile = require('./compile'),
generate = require('./generate');

module.exports = (name , planedNames = []) =>{

    if(planedNames.includes(name)){

        return ;
    }

    compile(name) ;

    name = getFullName(name) ;

    planedNames.push(name) ;

    if(Meta.has(name)){

        let importAllNames = Meta.getImportAllNames(name) ;

        for(let name of importAllNames){

            generate(name , '.fn.js' , planedNames) ;
        }
    }
}