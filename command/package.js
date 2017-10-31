const application = require('../src/application'),
      compiler = require('../src/compiler');

module.exports = (name = 'default') =>{

    let config = application.get(`package.${name}`) ;

    if(config){

        let {
            includes
        } = config ;

        let names = from(includes) ;

        for(let name of names){
            {
                let configs = application.parseSourceCodeNames(name) ;

                for(let config of configs){

                    console.log(script_get(config.path , application)) ;
                }
            } 
        }
    }
}