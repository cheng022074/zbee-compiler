const 
textCodeMetaRe = /^\/\*(?:.|[^.])+?\*\//,
textCodeMetaAsyncRe = /@async/,
textCodeMetaScopedRe = /@scoped/,
textCodeMetaRunAtRe = /@runat\s+([^\n\r]+)/,
textCodeMetaRunAtSplitRe = /\s+/,
textCodeMetaExtendRe = /@extend\s+([^\n\r]+)/,
{
    defineCacheProperties
} = require('./object'),
{
    split
} = require('./string');

class Meta{

    constructor(data){

        let me = this,
            match = data.match(textCodeMetaRe) ;

        if(match){

            me.data = match[0] ;
        
        }else{

            me.data = '' ;
        }

        me.code = data.replace(textCodeMetaRe , '') ;

        defineCacheProperties(this , [
            'async',
            'scoped',
            'runAt',
            'extend',
            'isApplyExtendKeyword',
            'requires',
            'imports',
            'ast',
        ]) ;
    }

    applyAst(){

        //  将源代码解析出Ast JSON树
    }

    applyIsApplyExtendKeyword(){

        // 解析代码
    }

    applyExtend(){

        let match = meta.match(textCodeMetaExtendRe) ;
        
        if(match){

            return match[1].trim() ;
        }

        return false ;
    }

    applyAsync(){

        return textCodeMetaAsyncRe.test(this.data) ;
    }

    applyScoped(){

        return textCodeMetaScopedRe.test(this.data) ;
    }

    applyRunAt(){

        let match = this.data.match(textCodeMetaRunAtRe) ;

        if(match){

            return split(match[1].trim() , textCodeMetaRunAtSplitRe) ;
        }

        return [
            'node',
            'browser'
        ] ;
    }

    toString(){

        return this.data ;
    }
}

exports.ScriptMeta = Meta ;