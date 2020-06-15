const {
    parse
} = require('../../../src/name'),
{
    getAllFilePaths
} = require('../../../src/fs'),
{
    APPLICATION
} = require('../../../src/project'),
{
    keys
} = require('../../../src/config'),
getSuffix  = require('../../file/suffix'),
removeSuffix = require('../../file/suffix/remove'),
exists = require('./exists'),
namespaceRe = /\.?\*$/,
dotRe = /\./g,
pathSepRe = /\/|\\/g,
{
    join,
    relative
} = require('path');

module.exports = codeName => {

    let {
        folder,
        name
    } = parse(codeName),
    suffixes = keys('code.source' , `${folder}.suffixes`);

    if(namespaceRe.test(name)){

        let folderPath = join(APPLICATION.getFolderPath(folder) , name.replace(namespaceRe , '').replace(dotRe , '/')),
            paths = getAllFilePaths(folderPath),
            names = [];

        for(let path of paths){

            let suffix = getSuffix(path) ;

            if(suffixes.includes(suffix)){

                names.push(removeSuffix(relative(folderPath , path)).replace(pathSepRe , '.')) ;

                continue ;
            }
        }

        return names ;
    
    }else if(exists(name)){

        return [
            name
        ] ;
    }

    return [] ;
}