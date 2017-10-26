const {
    join
} = require('path'),
{
    DIST_PATH
} = require('../../application');

module.exports = ({
    scope,
    name
}) =>{

    return join(DIST_PATH , scope , `${name}.html`) ;
}