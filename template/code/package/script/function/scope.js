exports['<%- fullName %>'] = (() =>{

    <%- requires %>

    <%- imports %>

    <%- configs %>

    <%- extend %>

    <%- code %>

    if(typeof main === 'function'){

        return function(<%- params %>){

            return main.apply(undefined , arguments) ;
        } ;
    }

})() ;