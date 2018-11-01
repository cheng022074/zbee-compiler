<%
    const {
        keys
    } = Object;
%>

<%

    let names = keys(data) ; 

    for(let name of names){

        let {
            code,
            aliases
        } = data[name] ;
%>
exports['<%- name %>'] = <%- code %>
<%
        for(let alias of aliases){
%>
exports['<%- alias %>'] = include('<%- name %>') ;
<%
        }
%>
<%
    }
%>