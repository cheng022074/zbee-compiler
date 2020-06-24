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
} = require('path'),
Meta = require('../bin/meta'),
getFullName = require('./name/full');

module.exports = codeName => {

    let {
        folder,
        name
    } = parse(codeName , 'src'),
    suffixes = keys('code.source' , `${folder}.suffixes`);

    if(namespaceRe.test(name)){

        let folderPath = APPLICATION.getFolderPath(folder),
            paths = getAllFilePaths(join(folderPath , name.replace(namespaceRe , '').replace(dotRe , '/'))),
            names = [];

        for(let path of paths){

            if(suffixes.includes(getSuffix(path))){

                names.push(`${folder}::${removeSuffix(relative(folderPath , path)).replace(pathSepRe , '.')}`) ;

                continue ;
            }
        }

        return [
            ...names,
            ...Meta.getExternalAllNames(getFullName(codeName))
        ] ;
    
    }else if(exists(codeName) || Meta.has(codeName)){

        return [
            codeName
        ] ;
    
    }

    return [] ;
}