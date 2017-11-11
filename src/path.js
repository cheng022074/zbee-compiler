const suffixRe = /(?:\.[^\.\/\\]+)+$/;

exports.extname = path =>{

    let match = path.match(suffixRe) ;

    if(match){

        return match[0] ;
    }

    return '' ;
}

const pathSplitRe = /\\|\//g,
      firstPathRe = /^(?:\\|\/)/;

exports.basename = (path , rootPath) =>{

    return path.replace(rootPath , '').replace(firstPathRe , '').replace(suffixRe , '').replace(pathSplitRe , '.') ;
}