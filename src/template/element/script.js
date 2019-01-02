const attrRe = /^attr\:([\:]+)$/ ;

const templatePlaceholderRe = /$\{\}/ ;

class ScriptElement extends require('../element'){

    static get resource(){

        return 'template.script' ;
    }

    static get namespace(){

        return 'script' ;
    }

    getImportNames(){

        return [] ;
    }

    get importNames(){

        let me = this,
            result = me.getImportNames(),
            {
                children
            } = me;

        for(let el of children){

            result.push(...el.importNames) ;
        }

        return result ;
    }
}

module.exports = ScriptElement ;