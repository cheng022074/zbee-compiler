const {
    join
} = require('path') ;

module.exports = (application , {
    scope,
    name
}) =>{

    return join(application.get('scope.bin') , scope , `${name}.js`) ;
}