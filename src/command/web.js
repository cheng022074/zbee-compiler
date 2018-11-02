const 
Server = require('webpack-dev-server'),
webpack = require('webpack'),
createLogger = require('webpack-dev-server/lib/utils/createLogger');

module.exports = () =>{

    let 
    options = {
        "contentBase": "C:\\Users\\nero.chen\\Desktop\\Code\\GitHub\\ZBEE\\SDK\\web",
        "host": "localhost",
        "publicPath": "/",
        "clientLogLevel": "info",
        "stats": {
            "cached": false,
            "cachedAssets": false,
            "colors": {
            "stdout": {
                "level": 3,
                "hasBasic": true,
                "has256": true,
                "has16m": true
            },
            "stderr": {
                "level": 3,
                "hasBasic": true,
                "has256": true,
                "has16m": true
            }
            }
        },
        "port": 8080
    },
    logger = createLogger(options),
    compiler = webpack({
        "mode": "development",
        "context": "C:\\Users\\nero.chen\\Desktop\\Code\\GitHub\\ZBEE\\SDK\\web",
        "entry": {
          "app": [
            "C:\\Users\\nero.chen\\Desktop\\Code\\GitHub\\ZBEE\\SDK\\node_modules\\_webpack-dev-server@3.1.10@webpack-dev-server\\client\\index.js?http://localhost:8080",
            "C:\\Users\\nero.chen\\Desktop\\Code\\GitHub\\ZBEE\\SDK\\web\\debug-test.js"
          ]
        },
        resolveLoader:{
            modules:[
                "C:\\\\Users\\\\nero.chen\\\\Desktop\\\\Code\\\\GitHub\\\\ZBEE\\\\SDK\\\\node_modules",
                "C:\\\\Users\\\\nero.chen\\\\Desktop\\\\Code\\\\GitHub\\\\ZBEE\\\\Compiler\\\\node_modules"
            ]
        },
        module:{
            rules: [{
                test: /.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',{
                        loader:'postcss-loader',
                        options:{
                            plugins:[
                                require('autoprefixer')
                            ]
                            
                        }
                    }
                    
                ]
            }]
        },
        "devServer": {
          "contentBase": "C:\\Users\\nero.chen\\Desktop\\Code\\GitHub\\ZBEE\\SDK\\web",
          "host": "localhost",
          "publicPath": "/",
          "clientLogLevel": "info",
          "stats": {
            "cached": false,
            "cachedAssets": false,
            "colors": {
              "stdout": {
                "level": 3,
                "hasBasic": true,
                "has256": true,
                "has16m": true
              },
              "stderr": {
                "level": 3,
                "hasBasic": true,
                "has256": true,
                "has16m": true
              }
            }
          },
          "port": 8080
        }
      }),
      server = new Server(compiler, options, logger);

    
      server.listen(8080) ;
}