module.exports = (() =>{

    <%- requires %>
    
    <%- imports %>

    <%- configs %>

    <%- code %>


    return function(<%- params %>){

        return main.apply(undefined , arguments) ;
    } ;

})() ;