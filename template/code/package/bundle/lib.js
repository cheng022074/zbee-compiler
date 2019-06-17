<%
    const {
        keys
    } = Object;
%>

<%

    let names = keys(data) ; 

    for(let name of names){

%>
exports['<%- name %>'] = <%- data[name] %>;
<%
    }
%>