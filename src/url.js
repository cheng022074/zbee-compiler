const {
    get:properties_get
} = require('./properties') ;

Object.defineProperties(exports , {
    BOOT_URL:{
        
        get:() =>{

            return `http://${properties_get('web.domain')}:${properties_get('web.port')}/${properties_get('web.boot.url')}` ;
        }
    },

    DEFAULT_API_URL:{

        get:() =>{

            return `http://${properties_get('web.domain')}:${properties_get('web.port')}` ;
        }
    }
}) ;

const urlRe = /^https?\:\/{2}\w+/ ;

exports.isValid = url =>{

    return urlRe.test(url) ;
}