<% if(async){ %>
exports = async (<%- params %>) =>{
<% }else{ %>
exports['<%- fullName %>'] = (<%- params %>) =>{
<%
    }
%>

    <%- requires %>

    <%- imports %>

    <%- configs %>

    <%- extend %>

    <%- code %>
} ;