exports.TESTING = 'testing' ;

exports.DEVELOPMENT = 'development' ;

exports.DEMO = 'demo' ;

exports.FORMAL = 'formal' ;

let environment ;

exports.reset() ;

exports.set = env =>{

    environment = env ;
}

exports.reset = () =>{

    environment = exports.DEVELOPMENT ;
}

exports.get = () =>{

    return environment ;
}

exports.getPropertiesPath = () =>{


}

exports.getConfigPath = () =>{


}