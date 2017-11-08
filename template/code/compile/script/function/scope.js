module.exports = (() =>{
    
    <%- imports %>

    <%- code %>

    if(typeof main === 'function'){

        return main ;
    }

})() ;