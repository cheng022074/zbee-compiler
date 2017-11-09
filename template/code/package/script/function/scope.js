exports['<%- fullName %>'] = (() =>{

    <%- imports %>

    <%- values %>

    <%- code %>

    if(typeof main === 'function'){

        return function(<%- params %>){

            return main.call(undefined , arguments) ;
        } ;
    }

})() ;