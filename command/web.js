const Koa = require('koa'),
      Koa_static = require('koa-static'),
      koa_mount = require('koa-mount'),
      {
        PATH,
        get
      } = require('../src/application'),
      {
          join
      } = require('path'),
      {
          directory:is_directory
      } = require('../src/is');

module.exports = port =>{

    const app = new Koa();

    {
        let routers = get('web.routers'),
            urls = Object.keys(routers);
        
        for(let url of urls){
    
            let path = join(PATH , routers[url]);
    
            if(is_directory(path)){
    
                app.use(koa_mount(url , Koa_static(path))) ;
            }
        }
    }

    port = port || get('web.port') ;

    app.listen(port) ;

    console.log('已启动' , `监听 ${port} 端口`) ;
}