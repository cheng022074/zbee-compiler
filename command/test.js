const {
    TEST,
    set:env_set
} = require('../src/environment') ;
module.exports = () =>{

    env_set(TEST) ;

    const {
        BOOT_URL
    } = require('../src/url') ;

    console.log(BOOT_URL) ;
}