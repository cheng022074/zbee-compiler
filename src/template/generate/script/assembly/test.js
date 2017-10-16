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
                codes = [],
                context = {
                    params:[]
                };

            for(let targetEl of targetEls){

                if(targetEl.tag === 'target'){

                    let {
                        name,
                        start,
                        end
                    } = targetEl.attrib ;

                    if(name){

                        codes.push(template_apply('generate.bin.script.assembly.test.target' ,  {
                            name,
                            start,
                            end,
                            code:generate_code(targetEl , context , 'test')
                        })) ;
                    }
                }
            }

            return {
                name,
                className,
                body:template_apply('generate.bin.script.assembly.test' ,  {
                    bootstrap:root.get('default'),
                    code:codes.join('\n'),
                    context
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