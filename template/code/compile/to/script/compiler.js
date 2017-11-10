{
    const usedCodes = {};

    function include(name){

       if(usedCodes.hasOwnProperty(name)){

            return usedCodes[name] ;
       }

       let code = ZBEE_APPLICATION.getBinCode(name) ;

       if(code){

            let caller = code.caller ;

            usedCodes[code.fullName] = caller ;

            return usedCodes[name] = caller ;
       }
    }
}

<%- code %>