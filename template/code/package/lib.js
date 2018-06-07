<%
    const {
        codeMap,
        aliasMap
    } = data,
    {
        keys
    } = Object;
%>

<%

    let codeNames = keys(codeMap) ; 

    for(let name of codeNames){
%>
exports['<%- name %>'] = <%- codeMap[name] %>
<%
    }
%>
<%
    let aliasNames = Object.keys(aliasMap) ;

    for(let name of aliasNames){
%>
exports['<%- name %>'] = include('<%- aliasMap[name] %>') ;
<%
    }
%>