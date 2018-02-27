<%
    if(scoped){
%>
<%- body %>
module.exports = function(<%- params %>){

    return main(<%- params %>) ;
}
<%
    }else{
%>
module.exports = function(<%- params %>){

    <%- body %>
}
<%
    }
%>