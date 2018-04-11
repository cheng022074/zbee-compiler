const 
textCodeMetaRe = /^\/\*(?:.|[^.])+?\*\//,
textCodeMetaAsyncRe = /@async/,
textCodeMetaScopedRe = /@scoped/,
textCodeMetaRunAtRe = /@runat\s+([^\n\r]+)/,
textCodeMetaRunAtSplitRe = /\s+/,
textCodeMetaExtendRe = /@extend\s+([^\n\r]+)/,
textCodeMetaParamTypeSplitRe = /\|/,
textCodeMetaParamNameRe = /^(\w+)(?:\.(\w+))?/,
textCodeMetaParamRestRe = /^\.{3}(\w+)/,
textCodeMetaParamTypeArrayRe = /\[\]$/,
textCodeMetaParamOptionalDefaultValueRe = /^(\w+)\s*\=(.+?)$/,
textCodeMetaAliasImportRe = /(\.?\w+)\s+from\s+((?:\w+\:{2})?\w+(?:\.\w+)*)/,
textCodeMetaAliasFirstDotImportRe = /^\./,
textCodeMetaConfigItemRe = /(\w+)\s+from\s+(\w+(?:\.\w+)*)(?:\.{3}(\w+(?:\.\w+)*))?/,
{
    defineCacheProperties
} = require('../../object'),
{
    split
} = require('../../string'),
{
    readTextFile
} = require('../../fs'),
{
    array:is_array
} = require('../../is'),
{
    toCamelCase,
    parse
} = require('../../name'),
{
    unique
} = require('../../array'),
{
    match:string_match
} = require('../../regexp');

module.exports = class {

    constructor(code){

        let me = this ;

        me.data = load(code.path) ;

        defineCacheProperties(me , [
            'code',
            'importNames',
            'generates'
        ]) ;
    }

    applyCode(){

        return this.coder.code ;
    }

    applyImportNames(){

        return [] ;
    }
}