module.exports = (() =>{

    <%- requires %>
    
    <%- imports %>

    <%- values %>

    <%- configs %>

    <%- code %>


    return function(<%- params %>){

        return main.apply(undefined , arguments) ;
    } ;

})() ;