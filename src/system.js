exports.getApplicationPath = (path = '') =>{

    return path_join(process.cwd() , path) ;
}

exports.getCompilerPath = path =>{

    return path_join(__dirname , '..' , path) ;
}