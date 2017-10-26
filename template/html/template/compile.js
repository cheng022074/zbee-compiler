module.exports = data =>{

    const config = <%- JSON.stringify(config) %> ;
    
    <%- code %>

    return config ;
}