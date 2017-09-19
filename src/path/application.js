const {
    join
} = require('path') ;

let currentPath = process.cwd() ;

if(currentPath === require('./compiler')){

    throw new Error('当前目录不合法') ;
}

module.exports = currentPath ;