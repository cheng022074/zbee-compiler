const application = require('../src/application'),
{
    from
} = require('../src/array'),
Compiler = require('../src/application/code/compiler'),
{
    red,
    green,
    yellow,
    magenta
} = require('cli-color'),
{
    execArgv
} = require('../src/process'),
{
    defined:is_defined,
    simpleObject:is_simple_object
} = require('../src/is'),
{
    format
} = require('../src/json');

module.exports = async function(name){

    if(name){

        let binCode = application.getBinCode(`test::${name}`) ;

        if(binCode){

           let testers = from(binCode.caller),
               names = [];

           if(execArgv && execArgv.compile !== 'false'){

                console.log('编译测试用代码...') ;
               
                for(let tester of testers){
                
                    if(tester.hasOwnProperty('action')){
    
                        names.push(`test::${tester.action}`) ;
                    }
                }
    
                new Compiler(names).compile() ;
           }

           console.log('测试开始...') ;

           for(let tester of testers){

                let {
                    test,
                    action,
                    params = {}
                } = tester ;
            
                if(action){

                    try{

                        let result = await application.executeBinCode(`test::${tester.action}` , params) ;

                        console.log('\t' , green('成功') , test) ;

                        if(tester.out === true){

                            console.log('参数 ---------------------------------------------------') ;

                            console.log(format(params)) ;

                            console.log('结果 ---------------------------------------------------') ;

                            if(is_defined(result)){

                                if(is_simple_object(result)){

                                    console.log(format(result)) ;
                                
                                }else{

                                    console.log(result) ;
                                }
                            }

                            console.log('---------------------------------------------------') ;
                        }

                    }catch(err){

                        console.log('\t' , red('失败') , test , err.message) ;

                        console.log(err) ;

                    }

                }else{

                    console.log('\t' , yellow('准备') , test) ;
                }
            }

            console.log('测试完成') ;

        }else{

            console.log('未找到测试配置' , name) ;
        }

    }else{

        console.log('未指定测试配置') ;
    }
}