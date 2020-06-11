const isDirectory = require('../is/directory') ;

const {
    mkdirSync
} = require('fs'),
folderRe = /(?:^\/)|(?:[^\/\\]+(?:[\/\\]|$))/g;

module.exports = path => {

    let folderNames = path.match(folderRe),
        folderPath = '';

    for(let folderName of folderNames){

        folderPath += folderName ;

        if(folderName !== '/' && !isDirectory(folderPath)){

            mkdirSync(folderPath) ;
        }
    }
}