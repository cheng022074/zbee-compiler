const {
    SourceCode,
    BinCode
} = require('../code'),
{
    run
} = require('../runner'),
compile = require('./compile');

module.exports = name =>{

    if(!name){

        console.info('请指定调试名称') ;

        return ;
    }

    name = `debug::${name}` ;

    if(compile(name)){

        run(BinCode.get(name).target) ;
    }
}