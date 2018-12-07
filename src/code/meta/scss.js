const
{
    readTextFile
} = require('../../fs'),
{
    toStylesheetCase,
    normalize
} = require('../../name'),
{
    defineCacheProperties
} = require('../../object'),
{
    parse
} = require('postcss'),
{
    stripComment
} = require('../../script'),
varRe = /^\$/,
placholderRe = /#\{[^\{\}]+\}/g;

module.exports = class {

    constructor(code){

        let me = this ;

        me.target = code ;

        defineCacheProperties(me , [
            'data',
            'importNames',
            'code'
        ]) ;

        me.placeholderMap = {} ;
    }

    applyData(){

        try{

            let me = this,
                {
                    placeholderMap
                } = me,
                data = stripComment(readTextFile(me.target.path)) ;

            return parse(data.replace(placholderRe , value =>{

                let name = `__placeholder_${Date.now()}__` ;

                placeholderMap[name] = value ;

                return name ;

            }));

        }catch(err){

       }

        return parse('') ;
    }

    applyImportNames(){

        return getImportNames(this.data) ;
    }

    applyCode(){

        let 
        me = this,
        {
            data
        } = me ;

        data = data.clone() ;

        data.walkAtRules('import' , rule => rule.remove()) ;

        return me.getCode(data) ;
    }

    getFullName(){

        return getFullName(this.target) ;
    }

    getCode(data){

        let me = this,
        {
            placeholderMap
        } = me ;

        fillFullName(data , this.getFullName()) ;

        data.walkDecls(varRe , decl => decl.remove()) ;

        let result = data.toResult().css ;

        let names = Object.keys(placeholderMap) ;

        for(let name of names){

            result = result.replace(name , placeholderMap[name]) ;
        }

        return result ;
    }

}

function getFullName(code){

    let {
        folder,
        name,
        fullName
    } = code ;

    if(folder === 'css'){

        return toStylesheetCase(name) ;
    }

    return toStylesheetCase(fullName) ;
}

const 
ruleRe = /&|\.-main-/,
ruleAndRe = /&/,
ruleMainRe = /\.-main-/g,
atRuleRe = /@mixin|@fucntion/;

function fillFullName(root , fullName){

    root.walkRules(ruleRe , rule =>{

        let {
            selector
        } = rule,
        className =  `.${fullName}`;

        rule.selector = selector
            .replace(ruleAndRe , className)
            .replace(ruleMainRe , `${className}-`);

    }) ;

    root.walkAtRules(atRuleRe , rule => rule.params = `${fullName}-${rule.params}`) ;
}

const quotationMarkRe = /^['"]|['"]$/g,
{
    clearEmpty
} = require('../../array');

function getImportNames(root){

    let names = [] ;

    root.walkAtRules('import' , rule => names.push(normalize(rule.params.replace(quotationMarkRe , '').trim() , 'css'))) ;

    return clearEmpty(names) ;
}