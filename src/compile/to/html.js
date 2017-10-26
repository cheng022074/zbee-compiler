const {
    join
} = require('path') ;

module.exports = (application , {
    scope,
    name
}) =>{

    return join(application.DIST_PATH , scope , `${name}.html`) ;
}