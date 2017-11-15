const Compiler = require('../src/application/code/compiler'),
      application = require('../src/application');

module.exports = name =>{

    if(name){

        result(new Compiler(name).compile(compile)) ;

    }else{

        new Compiler(application.get('compile.batch')).compile(compile) ;
    }
}

function compile(path){

    console.log('已编译' , path) ;
}

function result(paths){

    if(paths.length === 0){

        console.log('未找到代码' , name) ;
    }
}