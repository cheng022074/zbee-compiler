const parse = require('../parse') ;

module.exports = fullName => {

    let {
        folder,
        name
    } = parse(fullName , 'css') ;

    return `../${folder}/${name}.scss` ;
}