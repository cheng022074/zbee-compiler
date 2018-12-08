const FunctionMeta = require('./script/function')();

class Meta extends FunctionMeta{

    getRawBody(){

        return `const config = ${super.getRawBody()};
                function main(key){

                    return get(config , key) ;

                }
                ` ;
    }

    getImports(){

        return [{
            name:'get',
            target:'object.get'
        }] ;
    }

    getParams(){

        return [{
            name:'key',
            optiontal:true,
            types:[
                'string'
            ],
            items:[]
        }] ;
    }
}

module.exports = code =>{

    return new Meta(code) ;
}