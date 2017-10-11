const {
    get:properties_get
} = require('./properties') ;

exports.BOOT_URL = `http://${properties_get('web.domain')}:${properties_get('web.port')}/${properties_get('web.boot.url')}` ;

exports.DEFAULT_API_URL = `http://${properties_get('web.domain')}:${properties_get('web.port')}` ;

const urlRe = /^https?\:\/{2}\w+/ ;

exports.isValid = url =>{

    return urlRe.test(url) ;
}