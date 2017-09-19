const read_text_file = require('../text/read') ;

module.exports = path =>{

    let data = read_text_file(path) ;

    if(data){

        try{

            return JSON.parse(data) ;

        }catch(err){

            throw new Error(`${path} 不是一个有效的JSON文件`) ;
        }
    }
}