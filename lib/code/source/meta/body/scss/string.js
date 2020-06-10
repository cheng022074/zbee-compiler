const
{
    normalize,
    toImportCSSFileName,
    parse:nameParse
} = require('../../../../../../src/name'),
doubleQuoteRe = /\"([^\"]+)\"/,
getSourceCodeMetaType = require('../../type');

module.exports = function(){

    let {
        data
    } = this,
    root = data.clone() ;

    root.each(node => {

        let {
            type,
            name,
            params
        } = node ;

        if(type === 'atrule' && name === 'import'){

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

    }) ;

    return root.toString() ;
}