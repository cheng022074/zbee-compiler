const {
    format
} = require('../src/json'),
{
    copy
} = require('../src/object'),
application = require('../src/application');

module.exports = name =>{

    if(name){

        let code = application.getSourceCode(name) ;

        if(code){

            let {
                meta
            } = code ;

            if(meta){

                console.log(format(copy({} , meta , [
                    'runat',
                    'scoped',
                    'imports',
                    'params',
                    'configs',
                    'requires'
                ]))) ;
            }
        }
    }
}