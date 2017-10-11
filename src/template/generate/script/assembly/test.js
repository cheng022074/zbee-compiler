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

        if(root.tag === 'test'){

            let targetEls = root.getchildren(),
                codes = [];

            for(let targetEl of targetEls){

                if(targetEl.tag === 'target'){

                    let name = targetEl.get('name') ;

                    if(name){

                        codes.push(template_apply('generate.file.script.assembly.test.target' ,  {
                            name,
                            code:generate_code(targetEl , 'test')
                        })) ;
                    }
                }
            }

            return {
                name,
                className,
                body:template_apply('generate.file.script.assembly.test' ,  {
                    bootstrap:root.get('default'),
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