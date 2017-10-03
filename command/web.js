const Koa = require('koa'),
      KOA_STATIC = require('koa-static'),
      {
        WEB_ROOT_PATH
      } = require('../src/path'),
      {
          BOOT_URL
      } = require('../src/url'),
      {
          get:properties_get
      } = require('../src/properties'),
      open = require('opn');

module.exports = () =>{

    const app = new Koa();

    app.use(KOA_STATIC(WEB_ROOT_PATH));

    let port = properties_get('web.port') ;

    app.listen(port) ;

    console.log('已启动' , `监听 ${port} 端口`) ;

    open(BOOT_URL) ;
}