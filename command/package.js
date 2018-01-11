const Packager = require('../src/application/code/packager');

module.exports = (name = 'default') =>{

    let packager = new Packager(name) ;

    if(packager.exists){

        let paths = packager.package();

        for(let path of paths){

            console.log('已打包' , path) ;
        }

        packager.watch(paths =>{

            for(let path of paths){

                console.log('已打包' , path) ;
            }            
        }) ;
    
    }else{

        console.log('未找到打包设置') ;
    }
}