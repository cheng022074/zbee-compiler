<%
    const {
        keys
    } = Object;
%>

<%

    let names = keys(data) ; 

    for(let name of names){

        let {
            code
        } = data[name] ;
%>
exports['<%- name %>'] = <%- code %>;
<%
    }
%>