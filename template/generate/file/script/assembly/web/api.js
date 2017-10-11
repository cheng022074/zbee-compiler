<%
    options = JSON.stringify(options) ;

    if(varName){
%>
var <%- varName %> = await require('web.api').input('<%- uri %>' , '<%- method %>' , <%- options %>) ;
<%}else{%>
await require('web.api').input('<%- uri %>' , '<%- method %>' , <%- options %>) ;
<%}%>