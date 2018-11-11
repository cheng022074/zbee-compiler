const {
    SourceCode,
    BinCode
} = require('../code'),
{
    run
} = require('../runner'),
{
    simpleHTMLObject:isHTML
} = require('../is'),
web = require('./debug/web'),
generate = require('./debug/generate'),
compile = require('./compile');

module.exports = testName =>{

    if(!testName){

        console.info('请指定调试名称') ;

        return ;
    }

    let name = `debug::${testName}` ;

    if(compile(name)){
        let {
            target
        } = BinCode.get(name) ;

        if(isHTML(target)){

            web(generate(SourceCode.get(name))) ;

            SourceCode.watch([
                'src',
                'css',
                'debug'
            ] , () =>{

                generate(SourceCode.get(name)) ;

            }) ;

        }else{

            run(BinCode.get(name).target) ;
        }
    }
}