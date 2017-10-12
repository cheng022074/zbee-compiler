Object.defineProperties(exports , {

    command:{

        get:() =>{

            return '';
        }
    },

    argv:{

        get:() =>{

            return process.argv ;
        }
    },

    execArgv:{

        get:() =>{

            return process.argv ;
        }
    }

}) ;