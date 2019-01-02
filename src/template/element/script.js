const attrRe = /^attr\:([\:]+)$/ ;

const templatePlaceholderRe = /$\{\}/ ;

class ScriptElement extends require('../element'){

    static get resource(){

        return 'template.script' ;
    }

    static get namespace(){

        return 'script' ;
    }
}

module.exports = ScriptElement ;