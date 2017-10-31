const {
    parseSourceCodeName
} = require('./application'),
{
    transform,
    transformFileSync
} = require('babel-core'),
BABEL_PRESET_ENV = require('babel-preset-env'),
useStrictRe = /^[\'\"]use\sstrict[\'\"];/;

function process_compile_result({
    code,
    ast
}){

    return {
        code:code.replace(useStrictRe , ''),
        ast
    }
}

exports.compile = data =>{

    return process_compile_result(transform(data , {
        presets: [
            BABEL_PRESET_ENV
        ]
    })) ;
}

exports.compilePath = path =>{

    return process_compile_result(transformFileSync(path , {
        presets: [
            BABEL_PRESET_ENV
        ]
    })) ;
}

exports.get = path =>{

    let {
        ast
    } = exports.compilePath(path);

    return {
        path,
        paths:get_import_paths(ast)
    } ;
}

function get_import_paths(ast){

    let nodes = ast.program.body,
        result = [];
    
    for(let node of nodes){

        if(node.type === 'VariableDeclaration'){

            let declarations = node.declarations ;

            for(let declaration of declarations){

                let callNode = declaration.init ;

                if(callNode && callNode.type === 'CallExpression' && callNode.callee.name === 'require'){

                    let valueNode = callNode.arguments[0] ;

                    if(valueNode && valueNode.type === 'StringLiteral'){

                        let name = valueNode.value ;

                        if(valid(name)){

                            result.push(name) ;
                        
                        }else{

                            let ext = extname(name) ;

                            if(!ext){

                                result.push(`${name}.js`) ;

                            }else{

                                result.push(name) ;
                            }
                        }
                    }
                }
            }
        }
    }

    return result ;
}

function valid(){

    return true ;
}