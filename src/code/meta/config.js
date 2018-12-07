const FunctionMeta = require('./script/function')();

class Meta extends FunctionMeta{

    constructor(code){

        super(code) ;

        let {
            data
        } = this ;

        this.data = `const config = ${data};
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