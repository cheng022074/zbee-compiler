const Compiler = require('../src/application/code/compiler');

module.exports = name =>{

    if(name){

        let compiler = new Compiler(name) ;

        if(compiler.isEmpty){

            console.log('未找到代码' , name) ;
        
        }else{

            let paths = compiler.compile() ;

            for(let path of paths){

                console.log('已编译' , path) ;
            }
        }

    }else{

        console.log('请指定代码名称') ;
    }
}