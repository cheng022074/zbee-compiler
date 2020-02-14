const webpack = require('./webpack') ;

module.exports = (codes , {
    ...config,
    electron = 'renderer'
} , name) => webpack(codes , {
    ...config,
    webpack:{
        target:`electron-${electron}`
    }
} , name) ;