<%
    let params = context.params ;

    for(let param of params){
%>
var <%- param %> ;
<%
    }
%>
<%- code %>
<%
    if(bootstrap){
%>
exports.main = async function(){

    await exports['<%- bootstrap %>']() ;
}
<%
    }
%>