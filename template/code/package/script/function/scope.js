exports['<%- fullName %>'] = (() =>{

    <%- imports %>

    <%- code %>

    if(typeof main === 'function'){

        return main ;
    }

})() ;