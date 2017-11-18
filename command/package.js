const Packager = require('../src/application/code/packager');

module.exports = (name = 'default') =>{

    let packager = new Packager(name) ;

    if(packager.exists){

        path = packager.package();

        if(path){

            console.log('已打包' , path) ;

            packager.watch(path =>{

                if(path){

                    console.log('已打包' , path) ;
                }
                
            }) ;
        }
    
    }else{

        console.log('未找到打包设置') ;
    }
}