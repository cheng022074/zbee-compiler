const {
    join:path_join,
    extname
} = require('path'),
PATH = require('./path'),
{
    function:is_function,
    class:is_class,
    file:is_file,
    defined:is_defined,
    simpleObject:is_simpleObject
} = require('./is'),
{
    from:array_from
} = require('./array'),
{
    get:properties_get
} = require('./properties'),
{
    readXMLFile
} = require('./fs'),
{
    get:config_get
} = require('./config'),
{
        name2path,
        getFilePath,
        replaceSuffix,
        getApplicationPath
} = PATH,
{
    valid,
    parse:name_parse
} = require('./script/name');

let libraries ;

function get_libraries(){

    if(!libraries){

        libraries = [] ;

        let paths = array_from(properties_get('run.path.libraries')),
            rootPath = process.cwd();

        for(let path of paths){

            path = path_join(rootPath , path) ;

            if(is_file(path)){

                libraries.push(require(path)) ;
            }
        }
    }

    return libraries ;
}

const cache = {} ;

function get(name , isCache = true){

    if(isCache === false){

        delete cache[name] ;
    }

    let bootPath = properties_get('run.path.bin') ;
    
    if(is_defined(bootPath)){

        bootPath = path_join(process.cwd() , bootPath) ;

    }else{

        bootPath = process.cwd() ;
    }

    let path = path_join(bootPath , `${name2path(name)}.js`) ;

    if(is_file(path)){

        return cache[name] = require(path) ;
    }

    let libraries = get_libraries() ;

    for(let library of libraries){

        if(library.hasOwnProperty(name)){

            return cache[name] = library[name] ;
        }
    }

    path = replaceSuffix(path_join(__dirname , name2path(name)) , '.js') ;

    if(is_file(path)){

        return cache[name] = require(path) ;
    }
}

exports.has = name =>{

    return is_defined(get(name)) ;
}

exports.get = (name , isCache) =>{

    return get(name , isCache) ;
}

exports.execute = (name , ...args) =>{

    let target = exports.get(name) ;

    if(is_function(target)){

        return target(...args) ;

    }else if(is_class(target) || is_simpleObject(target)){

        let main = target.main ;

        if(is_function(main)){

            return main(...args) ;
        }
    }
}

const {
    js:removeComments
} = require('strip-comment') ;

exports.removeComments = removeComments ;

const {
    js_beautify
} = require('js-beautify') ;

exports.format = data =>{

    try{
        
        return js_beautify(data) ;

    }catch(err){
    }

    return data ;
}

const {
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

function get_import_uris(ast){

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

function get_import_paths(uris){

    let result = [];

    const COMPILE_SOURCE_PATH = PATH.COMPILE_SOURCE_PATH ;

    for(let uri of uris){

        let scriptPath = path_join(COMPILE_SOURCE_PATH , uri) ;

        if(is_file(scriptPath)){

            result.push(scriptPath) ;

        }else{

            let {
                    scope,
                    name
                } = name_parse(uri),
                sourcePath;

            if(scope){

                sourcePath = getApplicationPath(scope) ;
            
            }else{

                scopePath = COMPILE_SOURCE_PATH ;
            }

            scriptPath = getFilePath(path_join(scopePath , name2path(name)) , config_get('suffix')) ;

            if(scriptPath){

                result.push(scriptPath) ;
            }
        }
    }

    return result ;
}

function import_all_paths(path , allPaths , codes = {}){

    if(!codes.hasOwnProperty(path) && is_file(path)){

        let importPaths ;

        if(extname(path) === '.xml'){

            codes[path] = {} ;

            let code = readXMLFile(path , false),
                paramNodes = code.findall('params/param'),
                uris = [];

            for(let paramNode of paramNodes){

                uris.push(paramNode.get('name')) ;
            }

            importPaths = get_import_paths(uris) ;

        }else{

            importPaths = get_import_paths(get_import_uris(codes[path] = exports.compilePath(path).ast)) ;

        }
    
        for(let importPath of importPaths){

            allPaths.splice(allPaths.indexOf(path) , 0 , importPath) ;

            import_all_paths(importPath , allPaths , codes) ;
        }
    }
}

// 考虑到兼容 typescript

exports.importPaths = path =>{

    let paths = [
        path
    ] ;

    import_all_paths(path , paths) ;

    paths.pop() ;

    return paths ;
}