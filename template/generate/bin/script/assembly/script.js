<%
let params = context.params ;

for(let param of params){
%>
var <%- param %> ;
<%
}
%>
<%- code %>