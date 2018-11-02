const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    context:'<%- data.webPath %>',
    entry:{
        app:'<%- data.scriptPath %>'
    },
    resolve:{
        modules:<%- JSON.stringify(data.modules , null , 2) %>
    },
    devServer: {
        contentBase:'<%- data.webPath %>',
    },
    module:{
        rules: [{
            test: /.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'<%- data.htmlPath %>'
        })
    ]
} ;