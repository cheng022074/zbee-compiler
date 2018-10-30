const
{
    readTextFile
} = require('../../fs'),
{
    toStylesheetCase,
    normalize
} = require('../../name'),
{
    unique
} = require('../../array'),
{
    defineCacheProperties
} = require('../../object'),
{
    parse
} = require('postcss') ;

module.exports = class {

    constructor(code){

        let me = this ;

        me.target = code ;

        defineCacheProperties(me , [
            'data',
            'importNames',
            'code'
        ]) ;
    }

    applyData(){

        return parse(readTextFile(this.target.path).trim());
    }

    applyImportNames(){

        return getImportNames(this.data) ;
    }

    applyCode(){

        let {
            data,
            target,
        } = this ;

        return getCode(data , target) ;
    }

}

const dotRe = /\./g ;

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
varRe = /^\$/,
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

const quotationMarkRe = /^['"]|['"]$/g ;

function getImportNames(root){

    let names = [] ;

    root.walkAtRules('import' , rule => names.push(normalize(rule.params.replace(quotationMarkRe , '').trim() , 'css'))) ;

    return unique(names) ;
}

function getCode(root , code){

    root = root.clone() ;

    fillFullName(root , getFullName(code)) ;

    root.walkAtRules('import' , rule => rule.remove()) ;

    root.walkDecls(varRe , decl => decl.remove()) ;

    return root.toResult().css ;
}