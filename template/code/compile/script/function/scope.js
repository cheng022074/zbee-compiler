module.exports = (() =>{
    
    <%- imports %>

    <%- values %>

    <%- code %>

    if(typeof main === 'function'){

        return function(<%- params %>){

            return main.apply(undefined , arguments) ;
        } ;
    }

})() ;