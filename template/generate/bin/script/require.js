{
    let originRequire = require;

    require = name =>{

        let script = zb.script ;

        if(script.has(name)){

            return script.get(name) ;
        }

        return originRequire(name) ;
    }
}