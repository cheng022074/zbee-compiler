const application = require('../src/application'),
{
    from
} = require('../src/array'),
Compiler = require('../src/application/code/compiler'),
{
    red,
    green,
    yellow
} = require('cli-color');

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
                    action,
                    params = {}
                } = tester ;
            
                if(action){

                    try{

                        application.executeBinCode(`test::${tester.action}` , params) ;

                        console.log('\t' , green('成功') , test) ;

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