<%
    if(json_format){
%>
console.log(require('json').format(<%- expression %>)) ;
<%}else{%>
console.log(<%- expression %>) ;
<%}%>