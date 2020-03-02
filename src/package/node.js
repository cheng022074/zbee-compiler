const webpack = require('./webpack') ;

module.exports = (codes , config , name) => webpack(codes , {
    ...config,
    webpack:{
        target:'node'
    }
} , name) ;