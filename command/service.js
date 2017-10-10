const {
    get
} = require('../src/request') ;

module.exports = async function(){

    console.log(await get('http://www.baidu.com')) ;
}