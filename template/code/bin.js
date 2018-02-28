function include(name){

    let match = name.match(/^(\w+)\:(.+?)$/),
        folder,
        className;

    if(match){

        folder = match[1],
        className = match[2] ;

    }else{

        folder = '<%- data.defaultFolder %>',
        className = name ;
    }

    const {
        join
    } = require('path') ;

    return require(`../${folder}/${className}.js`) ;
}