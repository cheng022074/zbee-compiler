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