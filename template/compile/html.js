module.exports = ({<%- params.join(',') %>}) =>{

    const result = [] ;
    
    <%- code %>
    
    return result.join('') ;
}