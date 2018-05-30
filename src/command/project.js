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
    basename
} = require('path');

module.exports = (command , ...args) =>{

    if(project){

        let {
            bootstrap
        } = project ;

        switch(command){

            case 'run':
    
                if(bootstrap){

                    compile(bootstrap) ;

                    run(BinCode.get(bootstrap).target , ...args) ;
                
                }else{

                    console.log('无工程引导配置') ;
                }
    
                break ;
    
            case 'compile':

                if(bootstrap){

                    compile(bootstrap) ;
                
                }else{

                    console.log('无工程引导配置') ;
                }
    
                break ;
    
            case 'release':
 
                if(bootstrap){

                    let {
                        rootPath
                    } = APPLICATION,
                    {
                        classes
                    } = project;

                    classes = classes || [] ;
    
                    package({
                        classes:[
                            bootstrap,
                            ...classes
                        ],
                        name:basename(rootPath),
                        bootstrap,
                        independent:true
                    }) ;


                }else{

                    console.log('无工程引导配置') ;
                }
        }

    }else{

        console.log('无工程配置') ;
    }
}