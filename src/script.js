const {
    file:is_file
} = require('./is'),
{
    extname,
    join
} = require('path'),
{
    transform,
    transformFileSync
} = require('babel-core'),
BABEL_PRESET_ENV = require('babel-preset-env'),
useStrictRe = /^[\'\"]use\sstrict[\'\"];/;

function process_compile_result({
    code
}){

    return code.replace(useStrictRe , '') ;
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

exports.get = (path , layer) =>{

    let {
        ast
    } = exports.compilePath(path);

    return {
        path,
        requires:get_requires_paths(layer , path , ast)
    } ;
}

function get_requires_paths(layer , filePath , ast){

    let nodes = ast.program.body,
        result = {};
    
    for(let node of nodes){

        if(node.type === 'VariableDeclaration'){

            let declarations = node.declarations ;

            for(let declaration of declarations){

                let callNode = declaration.init ;

                if(callNode && callNode.type === 'CallExpression' && callNode.callee.name === 'require'){

                    let valueNode = callNode.arguments[0] ;

                    if(valueNode && valueNode.type === 'StringLiteral'){

                        let path = valueNode.value,
                            config = layer.parseSourceCodeName(path) ;

                        if(config){

                            result[path] = config.path ;
                        
                        }else{

                            let ext = extname(path),
                                targetPath;

                            if(!ext){

                                targetPath = join(filePath , `${path}.js`) ;

                            }else{

                                targetPath = join(filePath , path) ;
                            }

                            if(is_file(targetPath)){

                                result[path] = targetPath ;
                            }
                        }
                    }
                }
            }
        }
    }

    return result ;
}

function get_meta(layer , filePath , code){

    // 处理 JSON 数据

    // 处理 XML 数据

    // 处理 文本 数据
}