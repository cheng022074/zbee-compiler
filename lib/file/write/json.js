const write = require('../write') ;

module.exports = (path , data) => write(path , JSON.stringify(data , null , 2)) ;