<%
    let names = Object.keys(data) ;

    for(let name of names){
%>

exports.<%- name %> = include('<%- data[name] %>') ;

<%
    }
%>