const Koa = require('koa'),
      Koa_static = require('koa-static'),
      koa_mount = require('koa-mount'),
      koa_range = require('koa-range'),
      application = require('../src/application'),
      {
          join
      } = require('path'),
      {
          directory:is_directory
      } = require('../src/is');

module.exports = port =>{

    const app = new Koa();

    app.use(koa_range) ;

    {
        let routers = application.get('web.routers'),
            urls = Object.keys(routers);
        
        for(let url of urls){
    
            let path = join(application.PATH , routers[url]);
    
            if(is_directory(path)){
    
                app.use(koa_mount(url , Koa_static(path))) ;
            }
        }
    }

    port = port || application.get('web.port') ;

    app.listen(port) ;

    console.log('已启动' , `监听 ${port} 端口`) ;
}