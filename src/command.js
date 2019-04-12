{

    const {
        BinCode
    } = require('./code'),
    {
        defineProperties
    } = require('./object'),
    {
        get,
        keys
    } = require('./config'),
    {
        run
    } = require('./runner'),
    {
        simpleObject:is_object,
        defined:is_defined
    } = require('./is'),
    {
        parse
    } = require('./string/argument'),
    columnify = require('columnify');

    class Command{

        constructor(argv){

            let me = this ;
    
            me.argv = argv;

            defineProperties(me , [
                'name',
                'code'
            ]) ;
        }
    
        getName(){
    
            let me = this,
            {
                argv
            } = me ;

            if(me.exists){

                return argv[2] ;

            }else{

                throw new CommandNotDefinedException() ;
            }
        }

        getCode(){

            let name = this.name,
                codeName = get('command' , name) ;

            if(is_object(codeName)){

                codeName = codeName.implement ;
            }

            if(codeName){

                return BinCode.get(codeName) ;
            }

            throw new CommandNotFoundException(name) ;
        }
    
        get exists(){
    
            let {
                argv
            } = this ;

            return argv.length >= 3 ;
        }

        get args(){

            let {
                name,
                argv
            } = this,
            args = argv.slice(3),
            config = get('command' , name);

            if(is_object(config)){

                let {
                    params
                } = config ;

                if(params){

                    return parse(args , params) ;
                }
            }

            return args;
        }
    
        async run(){

            let {
                code,
                name,
                args
            } = this,
            result = await run(code.target , ...args),
            config = get('command' , name);

            if(is_object(config)){

                let {
                    result:isResult
                } = config ;

                if(isResult === true && is_defined(result)){

                    console.log(result) ;
                }
            }
        }
    }

    Command.printCommandNameList = () =>{

        let names = keys('command') ;

        console.log('命令:') ;

        let result = [] ;

        for(let name of names){

            let config = get('command' , name) ;

            if(is_object(config)){

                let {
                    description
                } = config ;

                result.push({
                    name,
                    description
                }) ;

            }else{

                result.push({
                    name,
                    description:'无'
                }) ;

            }
        }

        console.log(columnify(result , {
            showHeaders:false
        })) ;
    }
    
    exports.Command = Command ;
}

const {
    NotDefinedException,
    NotFoundException
} = require('./exception') ;

class CommandNotFoundException　extends NotFoundException{

    constructor(name){

        super('命令' , name) ;
    }
}

exports.CommandNotFoundException　= CommandNotFoundException ;

class CommandNotDefinedException extends NotDefinedException{

    constructor(){

        super('命令') ;
    }
}

exports.CommandNotDefinedException = CommandNotDefinedException ;