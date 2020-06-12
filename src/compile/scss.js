const {
    run
} = require('../runner'),
{
    BinCode
} = require('../code'),
{
    toBinSCSSFileName,
    toBinCSSFileName
} = require('../name'),
{
    writeTextFile
} = require('../fs'),
{
    join
} = require('path'),
{
    renderSync
} = require('node-sass');

module.exports = (code , codes) => {

    let sourceCodes = codes.keys(),
        isCompile = false;

    for(let sourceCode of sourceCodes){

        let {
            fullName,
            folder,
            name,
            metaName,
            project
        } = sourceCode;

        if(metaName === 'code.meta.scss'){

            if(codes.get(sourceCode) === true){

                let path = join(project.getFolderPath('bin') , folder , toBinSCSSFileName(name)) ;

                writeTextFile(path , BinCode.get(fullName).target()) ;

                console.log('已完成' , path) ;

                isCompile = true ;
            }
        }
    }

    if(isCompile){

        let {
            folder,
            name,
            project
        } = code,
        binPath = join(project.getFolderPath('bin') , folder),
        path = join(binPath , toBinCSSFileName(name));

        writeTextFile(path , renderSync({
            file:join(binPath , toBinSCSSFileName(name))
        }).css.toString('utf8')) ;

        console.log('已完成' , path) ;
    }
}