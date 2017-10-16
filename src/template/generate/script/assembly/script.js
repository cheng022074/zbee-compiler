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

        let root = parse(data).getroot(),
            context = {};

        if(root.tag === 'script'){

            let functionEls = root.getchildren(),
                codes = [],
                context = {
                    params:[]
                };

            for(let functionEl of functionEls){

                if(functionEl.tag === 'function'){

                    let {
                        name,
                    } = functionEl.attrib ;

                    if(name){

                        let nodes = functionEl.getchildren(),
                            params = [],
                            codeNodes = [];

                        for(let node of nodes){

                            if(node.tag === 'with-param'){

                                params.push(node.get('name')) ;
                            
                            }else{

                                codeNodes.push(node) ;
                            }
                        }

                        codes.push(template_apply('generate.file.script.assembly.function' ,  {
                            name,
                            params,
                            code:generate_code(codeNodes , context , 'script')
                        })) ;
                    }
                }
            }

            return {
                name,
                className,
                body:template_apply('generate.file.script.assembly.script' ,  {
                    code:codes.join(''),
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