const {
    set:object_set,
    get:object_get
} = include('object') ;
module.exports = data =>{

    const config = <%- JSON.stringify(config) %> ;
    
    <%- code %>

    return config ;
}