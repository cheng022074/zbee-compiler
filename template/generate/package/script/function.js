exports['<%- name %>'] = (() =>{

    <%- body %>

    if(typeof main === 'function'){
    
        return main ;
    }

})() ;