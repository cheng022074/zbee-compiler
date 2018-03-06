<%- apply('code.bin' , {
    defaultFolder:data.defaultFolder
}) %>
<%- data.imports %>
<%
    if(data.scoped){
%>
<%- data.body %>
module.exports = function(<%- data.params %>){

    return main(<%- data.paramNames %>) ;
}
<%
    }else{
%>
module.exports = function(<%- data.params %>){

    <%- data.body %>
}
<%
    }
%>