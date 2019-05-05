const {
    SourceCode,
    BinCode
} = require('../code'),
{
    run
} = require('../runner'),
compile = require('./compile'),
{
    green,
    red
} = require('colors');

module.exports = async (name) =>{

    if(!name){

        console.info('请指定调试名称') ;

        return ;
    }

    name = `debug::${name}` ;

    if(compile(name)){

        run(BinCode.get(name).target) ;
    
    }else{

        const log = console.log.bind(console) ;

        console.log = () =>{} ;

        let codes = SourceCode.getMany(`${name}.*`) ;

        for(let {
            meta,
            fullName
        } of codes){

            if(meta.params.length === 0){

                compile(fullName) ;

                try{

                    await run(BinCode.get(fullName).target) ;

                    log(green('成功') , fullName) ;

                }catch(err){

                    log(red('失败') , fullName) ;
                }

                
            }
        }
    }
}