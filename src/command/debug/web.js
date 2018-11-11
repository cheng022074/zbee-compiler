const 
Server = require('webpack-dev-server'),
webpack = require('webpack'),
createLogger = require('webpack-dev-server/lib/utils/createLogger'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
{
    COMPILER,
    APPLICATION
} = require('../../project'),
{
    join
} = require('path');

module.exports = ({
    webPath,
    scriptPath,
    htmlPath
}) =>{

    let options = {
        contentBase:webPath,
        host: 'localhost',
        publicPath: '/',
        clientLogLevel: 'info',
        stats: {
            cached: false,
            cachedAssets: false,
            colors: {
            stdout: {
                level: 3,
                hasBasic: true,
                has256: true,
                has16m: true
            },
            stderr: {
                level: 3,
                hasBasic: true,
                has256: true,
                has16m: true
            }
            }
        },
        port: 8080
    },
    server = new Server(webpack({
        "mode": "development",
        "context": webPath,
        "entry": {
            "app": [
            `${join(COMPILER.nodeModulesPath , 'webpack-dev-server' , 'client' , 'index.js')}?http://localhost:8080`,
            scriptPath
            ]
        },
        resolveLoader:{
            modules:[
                APPLICATION.nodeModulesPath,
                COMPILER.nodeModulesPath
            ]
        },
        module:{
            rules: [{
                test: /.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            plugins:[
                                require('autoprefixer')
                            ]
                        }
                    },
                    'sass-loader'
                    
                ]
            }]
        },
        plugins:[
            new HtmlWebpackPlugin({
                filename:'index.html',
                template:htmlPath
            })
        ],
        devServer:options
    }) , options , createLogger(options)) ;

    server.listen(8080) ;
}