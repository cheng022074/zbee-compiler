const application = require('../src/application'),
{
    from
} = require('../src/array'),
Compiler = require('../src/application/code/compiler'),
{
    red,
    green
} = require('cli-color'),
{
    params
} = require('../src/script/function');

module.exports = async function(name){

    if(name){

        let binCode = application.getBinCode(`test::${name}`) ;

        if(binCode){

           let testers = from(binCode.caller),
               names = [];

           console.log('装载测试配置...') ;

           for(let tester of testers){

                if(tester.hasOwnProperty('action')){

                    names.push(`test::${tester.action}`) ;
                }
           }

           console.log('准备测试代码...') ;

           new Compiler(names).compile() ;

           for(let tester of testers){

                let {
                    test,
                    action
                } = tester ;
            
                if(action){

                    try{

                        let code = application.getBinCode(`test::${tester.action}`) ;

                        if(code){

                            console.log(params(code.caller)) ;
                        }

                        //application.executeBinCode(`test::${tester.action}`) ;

                        console.log('\t' , green('成功') , test) ;

                    }catch(err){

                        console.log('\t' , red('失败') , test , err.message) ;

                        console.log(err) ;

                    }
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