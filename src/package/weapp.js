const
webpack = require('./webpack'),
{
    NormalModuleReplacementPlugin
} = webpack,
TerserPlugin  = require('terser-webpack-plugin'),
{
    join
} = require('path');

module.exports = (codes , config , name) => webpack(codes , {
    ...config,
    webpack:{
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions:{
                        compress:{
                            drop_console:true
                        }
                    }
                })
            ]
        },
        plugins:[
            new NormalModuleReplacementPlugin(/^ws$/ , join(__dirname , 'weapp/ws'))
        ]
    }
} , name) ;