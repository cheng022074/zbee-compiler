class Command{

    constructor(command){

        try{

            this.command = require(`../command/${command}`) ;

        }catch(err){

            throw new Error(`访问 ${command} 出现错误`) ;
        }
    }

    exec(argv){


    }
}

module.exports = Command ;