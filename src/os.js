const {
    type
} = require('os'),
osType = type();

Object.defineProperties(exports , {

    isWindows:{

        get:() =>{

            return osType === 'Windows_NT';
        }
    },

    isMac:{

        get:() =>{

            return osType === 'Darwin';
        }
    },

    isLinux:{
        
        get:() =>{

            return osType === 'Linux';
        }
    }

}) ;