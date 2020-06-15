const {
    parse
} = require('../../../src/name'),
{
    keys
} = require('../../../src/config'),
{
    APPLICATION
} = require('../../../src/project'),
isFile = require('../../is/file'),
{
    join
} = require('path'),
dotRe = /\./g;

module.exports = codeName => {

    let {
        folder,
        name
    } = parse(codeName),
    suffixes = keys('code.source' , `${folder}.suffixes`),
    path = join(APPLICATION.getFolderPath(folder) , name.replace(dotRe , '/'));

    for(let suffix of suffixes){

        let filePath = `${path}${suffix}` ;

        if(isFile(filePath)){

            return filePath ;
        }
    }

    return false ;
}