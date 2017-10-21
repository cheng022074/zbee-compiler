const {
    defineProperties,
    assign,
    get
} = require('../object') ;

module.exports = target =>{

    defineProperties(target , {

        SCOPE_PATHS:{

            once:true,

            get:() =>{


            }
        },

        DEFAULT_SCOPE_PATH:{

            once:true,

            get:() =>{


            }
        }

    }) ;

    target.getSourceCodePath = name =>{


    }

    target.getBinCodePath = name =>{


    }

    target.getSourceCode = name =>{


    }

    target.getBinCode = name =>{

        
    }
}