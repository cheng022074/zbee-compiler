module.exports = (() =>{
    
    <%- imports %>

    <%- code %>

    if(typeof main === 'function'){

        return function(<%- params %>){

            return main.apply(undefined , arguments) ;
        } ;
    }

})() ;