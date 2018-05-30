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
compile = require('./compile');

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
    
                console.log('发布工程') ;
        }

    }else{

        console.log('无工程配置') ;
    }
}