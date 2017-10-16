const {
    join:path_join
} = require('path'),
{
    getApplicationPath,
    name2path
} = require('../../../../path'),
{
    apply:template_apply
} = require('../../../../template');

module.exports = (context , attrs) =>{

    let {
        type,
        file,
        scope,
        var:varName
    } = attrs ;

    let path = path_join(getApplicationPath(scope) , name2path(file));

    switch(type){

        case 'read':

            let {
                key,
                data
            } = attrs ;

            return template_apply('generate.file.script.assembly.excel.read' , {
                path,
                key,
                data,
                varName
            }) ;

            break ;
    }
}