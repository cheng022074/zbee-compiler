const {
    join
} = require('path'),
{
    BIN_PATH
} = require('../../application');

module.exports = ({
    scope,
    name
}) =>{

    return join(BIN_PATH , scope , `${name}.js`) ;
}