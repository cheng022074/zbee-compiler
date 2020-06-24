const Meta = require('../../lib/code/bin/meta'),
{
    APPLICATION
} = require('../project'),
{
    writeTextFile,
    remove
} = require('../fs'),
{
    join
} = require('path'),
{
    renderSync
} = require('node-sass');

module.exports = (metas , rootPath) => {

    let names = Object.keys(metas),
        result = [];

    for(let name of names){

        if(Meta.getMetaType(name) === 'css'){

            let {
                folder,
                name:codeName
            } = metas[name] ;

            result.push(`@import '${APPLICATION.generateBinPath(folder , codeName , '.scss').replace(/\\/g , '/')}';`) ;
        }
    }

    if(result.length){

        let scssPath = join(rootPath , 'index.scss') ;

        writeTextFile(scssPath , result.join('\n')) ;

        let data = renderSync({
            file:scssPath
        }).css.toString('utf8') ;

        remove(scssPath) ;

        return data ;
    }
}