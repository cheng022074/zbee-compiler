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
    basename,
    join,
    isAbsolute
} = require('path'),
{
    file:is_file,
    directory:is_directory
} = require('../is'),
{
    copy,
    remove
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
            allClassNames
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

                package({
                    classes:allClassNames,
                    name:'default',
                    bootstrap
                }) ;

                let packagePath = APPLICATION.getFolderPath('package') ;

                remove(join(packagePath , 'lib.js')) ;

                remove(join(packagePath , 'meta.xml')) ;

                copy(join(rootPath , 'package.json') , packagePath) ;

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