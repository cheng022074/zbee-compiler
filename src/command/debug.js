const {
    SourceCode,
    BinCode
} = require('../code'),
{
    run
} = require('../runner'),
{
    simpleObject:isObject
} = require('../is'),
{
    COMPILER,
    APPLICATION
} = require('../project'),
{
    toStylesheetCase
} = require('../name'),
{
    writeTextFile
} = require('../fs'),
{
    join
} = require('path'),
{
    apply
} = require('../template'),
Server = require('webpack-dev-server'),
webpack = require('webpack'),
createLogger = require('webpack-dev-server/lib/utils/createLogger'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
compile = require('./compile'),
package = require('./package'),
{
    watch
} = require('chokidar'),
{
    fork
} = require('child_process');

module.exports = (testName , watchMode) =>{

    if(!testName){

        console.info('请指定调试名称') ;

        return ;
    }

    let name = `debug::${testName}` ;

    if(compile(name)){
        let {
            target
        } = BinCode.get(name) ;

        if(isObject(target) && target.type === 'html' && target.hasOwnProperty('data')){

            let result = generate(SourceCode.get(name) , target.data) ;

            if(watchMode !== 'watch'){

                web(result) ;
            
                const doGenerate = () =>{

                    fork(join(__dirname , '..' , '..' , 'bin' , 'zb') , [
                        'debug',
                        testName,
                        'watch'
                    ]) ;
                } ;
    
                watch([
                    APPLICATION.getFolderPath('src'),
                    APPLICATION.getFolderPath('css'),
                    APPLICATION.getFolderPath('debug')
                ])
                .on('change' , doGenerate)
                .on('unlink' , doGenerate);
     
            }

        }else{

            run(BinCode.get(name).target) ;
        }
    }
}

function web({
    webPath,
    scriptPath,
    htmlPath
}){

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

function generate({
    fullName,
    target
} , data){

    let webPath = APPLICATION.getFolderPath('web') ;

    fullName = toStylesheetCase(fullName) ;

    let htmlPath = join(webPath , `${fullName}.html`) ;

    writeTextFile(htmlPath , data) ;

    console.log('已生成' , htmlPath) ;

    let scriptPackagePath = join(webPath , fullName ,  'package.js') ;

    writeTextFile(scriptPackagePath , packageScriptData(target.meta)) ;

    console.log('已生成' , scriptPackagePath) ;

    let cssPackagePath = join(webPath , fullName , 'package.scss') ;

    writeTextFile(cssPackagePath , packageCSSData(target.meta)) ;

    console.log('已生成' , cssPackagePath) ;

    let scriptPath = join(webPath , `${fullName}.js`) ;

    writeTextFile(scriptPath , apply('webpack.script' , fullName)) ;

    console.log('已生成' , scriptPath) ;

    return {
        webPath,
        scriptPath,
        htmlPath
    } ;
}

const {
    values
} = Object ;

function packageCSSData({
    importCSSNames
}){

    return values(package({
        classes:importCSSNames,
        type:'css',
        memory:true
    }))[0] ;
}

function packageScriptData({
    importScriptNames
}){

    return values(package({
        classes:importScriptNames,
        type:'browser',
        memory:true
    }))[0] ;
}