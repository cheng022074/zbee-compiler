<%- code %>
<%
    if(bootstrap){
%>
exports.main = () =>{

    exports['<%- bootstrap %>']() ;
}
<%
    }
%>