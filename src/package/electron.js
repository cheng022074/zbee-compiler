const webpack = require('./webpack') ;

module.exports = (codes , {
    electron = 'renderer',
    ...config
} , name) => webpack(codes , {
    ...config,
    webpack:{
        target:`electron-${electron}`
    }
} , name) ;