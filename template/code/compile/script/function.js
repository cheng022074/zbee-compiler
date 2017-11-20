<% if(!async){ %>
module.exports = (<%- params %>) =>{
<% }else{ %>
module.exports = async function(<%- params %>){
<%
   }
%>
    <%- requires %>

    <%- imports %>

    <%- configs %>

    <%- extend %>

    <%- code %>
} ;