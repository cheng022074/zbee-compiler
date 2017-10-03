const {
    get:properties_get
} = require('./properties') ;

exports.BOOT_URL = `http://${properties_get('web.domain')}:${properties_get('web.port')}/${properties_get('web.url.boot')}` ;