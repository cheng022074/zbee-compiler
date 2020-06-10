const
{
    normalize,
    toImportCSSFileName,
    parse:nameParse,
    toStylesheetCase
} = require('../../../../../../src/name'),
doubleQuoteRe = /\"([^\"]+)\"/,
getSourceCodeMetaType = require('../../type'),
variablePrefixRe = /^\$/;

module.exports = function(){

    let {
        data,
        meta
    } = this,
    root = data.clone(),
    styleCodeName = toStylesheetCase(meta.code.fullName);

    root.each(node => {

        let {
            type,
            name,
            params,
            prop
        } = node ;

        switch(type){

            case 'decl':

                node.prop = `$${styleCodeName}-${prop.replace(variablePrefixRe , '')}` ;

                break ;

            case 'atrule':

                if(name === 'import'){

                    let [
                        ,
                        fullName
                    ] = params.match(doubleQuoteRe),
                    {
                        folder,
                        name
                    } = nameParse(fullName , 'css');
        
                    if(getSourceCodeMetaType(normalize(fullName , 'css')) === 'css'){
        
                        node.params = `"${toImportCSSFileName(folder , name)}"` ;
                    
                    }else{
        
                        root.removeChild(node) ;
                    }
                }
        }

    }) ;

    return root.toString() ;
}