const {
    dirname,
    sep,
    join
} = require('path'),
{
    directory:is_directory,
    file:is_file,
    empty:is_empty
} = require('./is'),
{
    readFileSync,
    writeFileSync,
    mkdirSync,
    readdirSync,
    statSync
} = require('fs'),
{
    parse:xml_parse
} = require('elementtree'),
{
    basename
} = require('./path'),
{
    parse:html_parse
} = require('./html'),
{
    unique
} = require('./array');


const folderRe = /(?:^\/)|(?:[^\/\\]+(?:[\/\\]|$))/g;

function create_directory(path){

    let folderNames = path.match(folderRe),
        folderPath = '';

    for(let folderName of folderNames){

        folderPath += folderName ;

        if(folderName !== '/' && !is_directory(folderPath)){

            mkdirSync(folderPath) ;
        }
    }
}

exports.writeTextFile = (path , data) =>{

    create_directory(dirname(path)) ;

    writeFileSync(path , data.toString()) ;
}

exports.readTextFile = path =>{

    try{

        return readFileSync(path , 'utf8') ;
    
    }catch(err){

    }
}

exports.readJSONFile = path =>{

    let data = exports.readTextFile(path) ;

    if(data){

        try{

            return JSON.parse(require('strip-comment').js(data)) ;

        }catch(err){
        }
    }
}

exports.readXMLFile = path =>{

    let data = exports.readTextFile(path) ;
    
    if(data){

        return xml_parse(data) ;
    }
}

exports.readHTMLFile = path =>{

    let data = exports.readTextFile(path) ;

    if(data){

        return html_parse(data);
    }
}

const suffixRe = /(?:\.[^\.]+)+$/ ;

function readCodeNames(path , suffixes , rootName = ''){
    
    let names ;

    try{

        names = readdirSync(path) ;

    }catch(err){

        names = [] ;
    }
    
    let result = [] ;

    for(let name of names){

        let targetPath = join(path , name) ;

        if(is_file(targetPath)){

            let match = name.match(suffixRe) ;

            if(match){

                suffix = match[0] ;

                if(suffixes.includes(suffix)){

                    result.push(`${rootName}${name.replace(suffixRe , '')}`) ;
                }
            }

        }else{

            result.push(...readCodeNames(targetPath , suffixes , `${rootName}${name}.`)) ;
        }
    }

    return unique(result) ;
}

exports.readCodeNames = readCodeNames ;

exports.getFileUpdateTime = path => {

    try{

        return statSync(path).mtime.getTime() ;

    }catch(err){
        
    }
}