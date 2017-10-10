const Koa = require('koa'),
      Koa_static = require('koa-static'),
      koa_mount = require('koa-mount'),
      koa_send = require('koa-send'),
      {
        getApplicationPath
      } = require('../src/path'),
      {
          BOOT_URL
      } = require('../src/url'),
      {
          get:properties_get
      } = require('../src/properties'),
      open = require('opn'),
      {
          file:is_file,
          directory:is_directory
      } = require('../src/is');

module.exports = () =>{

    const app = new Koa();

    {
        let config = properties_get('web.url'),
            urls = Object.keys(config);
        
        for(let url of urls){
    
            let path = config[url];
    
            if(is_file(path)){
    
                app.use(koa_mount(url , async function(ctx){
    
                    await koa(ctx , PATH.basename(path) , {
                        root:PATH.dirname(path)
                    }) ;
    
                })) ;
    
            }else if(is_directory(path)){
    
                app.use(koa_mount(url , Koa_static(path))) ;
            }
    
        }
    }

    let port = properties_get('web.port') ;

    app.listen(port) ;

    console.log('已启动' , `监听 ${port} 端口`) ;

    open(BOOT_URL) ;
}