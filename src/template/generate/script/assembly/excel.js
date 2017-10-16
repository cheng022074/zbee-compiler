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

    let path = path_join(getApplicationPath(scope) , name2path(file , '.xlsx'));

    switch(type){

        case 'read':

            let {
                key,
                data
            } = attrs ;

            if(!key){

                key = 'A1' ;
            }

            if(!data){

                data = 'A2' ;
            }

            return template_apply('generate.file.script.assembly.excel.read' , {
                path,
                key,
                data,
                varName
            }) ;

            break ;
    }
}