const 
execArgRe = /^\-{2}([a-z\-]+)(?:=([^=]+))?$/,
{
    env,
    argv
} = process,
{
    resolve
} = require('path');

module.exports = () =>{

    let values = [] ;

    for(let value of argv){

        let match = value.match(execArgRe) ;

        if(match){

            let [
                ,
                name,
                value
            ] = match ;

            switch(name){

                case 'env':

                    env['ZBEE-ENV'] = value.toLowerCase() ;

                    break ;

                case 'path':

                    env['ZBEE-APP-PATH'] = resolve(value) ;

                    break ;

                default:

                    env[`ZBEE-PARAM-${name.toUpperCase()}`] = value || name;

            }

        }else{

            values.push(value) ;
        }
    }

    if(!env.hasOwnProperty('ZBEE-APP-PATH')){

        env['ZBEE-APP-PATH'] = process.cwd() ;
    }

    return values ;
}
