(() =>{

    const nameRe = /^(\w+)\:{2}(.+?)$/,
          CODES = {},
          configNameRe = /^config\:{2}/,
          libraries = <%- JSON.stringify(data.libraries) %>,
          len = libraries.length,
          {
            join
          } = require('path');

    for(let i = 0 ; i < len ; i ++){

        let path = libraries[i] ;

        try{

            libraries[i] = require(join(path , 'lib.js')) ;

        }catch(err){

            if(err.message.indexOf('Cannot find module') !== -1){

                throw new Error(`无效的类库路径 ${path}`) ;
            }

            throw err ;
        }
    }

    return name =>{

        if(CODES.hasOwnProperty(name)){

            return CODES[name] ;
        }

        let match = name.match(nameRe),
            folder,
            className;
    
        if(match){
    
            folder = match[1],
            className = match[2] ;
    
        }else{
    
            folder = '<%- data.defaultFolder %>',
            className = name ;
        }
    
        const {
            join
        } = require('path'),
        fullName = `${folder}::${className}`;

        try{

            return CODES[name] = CODES[fullName] = require(`./${folder}/${className}.js`) ;

        }catch(err){

            if(err.message.indexOf('Cannot find module') !== -1){

                for(let library of libraries){

                    if(library.hasOwnProperty(fullName)){

                        return CODES[name] = library[fullName] ;
                    }
                }

                throw new Error(`${fullName} 没有定义`) ;
            }

            throw err ;
        }
    } ;

})()