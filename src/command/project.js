const {
    APPLICATION
} = require('../project'),
{
    project
} = APPLICATION.properties,
{
    BinCode
} = require('../code'),
{
    run
} = require('../runner'),
compile = require('./compile'),
package = require('./package'),
{
    join,
    isAbsolute
} = require('path'),
{
    directory:is_directory
} = require('../is'),
{
    copy,
    remove,
    writeJSONFile,
    rename
} = require('../fs'),
{
    from
} = require('../array');

function doProject(command , ...args){

    if(project){

        let {
            bootstrap
        } = project,
        {
            rootPath,
            allClassNames,
            dependentModules,
            moduleName
        } = APPLICATION;

        switch(command){

            case 'run':
    
                if(bootstrap){

                    doProject('compile') ;

                    run(BinCode.get(bootstrap).target , ...args) ;
                
                }else{

                    console.log('无工程引导配置') ;
                }
    
                break ;
    
            case 'compile':

                for(let name of allClassNames){

                    compile(name) ;
                }
    
                break ;
    
            case 'release':

                let {
                    config,
                    browser
                } = project,
                baseConfig = {
                    browser,
                    classes:allClassNames,
                    name:'default',
                    bootstrap
                },
                [
                    name
                ] = args ;

                if(config && name){

                    baseConfig.config = config[name] ;
                }

                package(baseConfig) ;

                let packagePath = APPLICATION.getFolderPath('package') ;

                remove(join(packagePath , 'lib.js')) ;

                remove(join(packagePath , 'meta.xml')) ;

                writeJSONFile(join(packagePath , 'package.json') , {
                    name:moduleName,
                    dependencies:dependentModules
                }) ;

                rename(join(packagePath , 'index.js') , `${moduleName}.js`) ;

                break ;

            case 'sync':

                let {
                    sync
                } = project;

                if(sync){

                    let {
                        resources,
                        targets
                    } = sync ;

                    if(resources && targets){

                        for(let target of targets){

                            if(!isAbsolute(target) || !is_directory(target)){

                                continue ;
                            }

                            for(let resource of resources){

                                if(rootPath === target){

                                    continue ;
                                }

                                let result = from(copy(join(rootPath , resource) , target)) ;

                                for(let path of result){

                                    console.log('已复制' , path) ;
                                }
                            }
                        }
                    }
                }
        }

    }else{

        console.log('无工程配置') ;
    }
}

module.exports = doProject ;