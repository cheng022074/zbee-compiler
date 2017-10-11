const {
    parse
} = require('elementtree'),
get_headers = require('../../script'),
generate_code = require('./code'),
{
    apply:template_apply
} = require('../../../../template');

module.exports = (data , path) =>{

    let {
        name,
        className
    } = get_headers(data , path) ;

    try{

        let root = parse(data).getroot();

        if(root.tag === 'function'){

            generate_code(root.find('body') , 'script') ;

            return {
                name,
                className,
                body:template_apply('generate.file.script.assembly.function' ,  {
                    code:codes.join('\n')
                })
            } ;
        }

    }catch(err){

        console.error(data) ;

        console.error(err) ;
    }

    return {
        name,
        className,
        body:''
    } ;
}