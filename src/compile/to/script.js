const {
    join
} = require('path') ;

module.exports = (application , {
    scope,
    name
}) =>{

    return join(application.BIN_PATH , scope , `${name}.js`) ;
}