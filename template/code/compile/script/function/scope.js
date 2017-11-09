module.exports = (() =>{
    
    <%- imports %>

    <%- values %>

    <%- extend %>

    <%- code %>


    return function(<%- params %>){

        return main.apply(undefined , arguments) ;
    } ;

})() ;