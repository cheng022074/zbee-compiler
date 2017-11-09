exports['<%- fullName %>'] = (() =>{

    <%- imports %>

    <%- values %>

    <%- extend %>

    <%- code %>

    if(typeof main === 'function'){

        return function(<%- params %>){

            return main.call(undefined , arguments) ;
        } ;
    }

})() ;