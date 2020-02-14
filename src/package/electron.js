const webpack = require('./webpack') ;

module.exports = (codes , {
    ...config,
    electron = 'renderer'
} , name) =>{

    return webpack(codes , {
        ...config,
        webpack:{
            target:`electron-${electron}`
        }
    } , name) ;
}