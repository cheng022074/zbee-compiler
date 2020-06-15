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
exists = require('./exists'),
namespaceRe = /\.\*$/,
dotRe = /\./g;

module.exports = codeName => {

    let {
        folder,
        name
    } = parse(codeName),
    suffixes = keys('code.source' , `${folder}.suffixes`);

    if(namespaceRe.test(name)){

        let paths = getAllFilePaths(APPLICATION.getFolderPath(folder) , name.replace(namespaceRe , '').replace(dotRe , '/')),
            names = [];

        for(let path of paths){

            if(suffixes.includes(getSuffix(path))){

                names.push(name) ;

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