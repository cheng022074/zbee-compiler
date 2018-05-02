<%
    const {
        independent,
        bootstrap,
        codes
    } = data ;
    if(independent === true){
%>
const include = <%- apply('code.package.header.include' , {
    defaultFolder:data.defaultFolder
}) %>,
gettype = <%- apply('code.gettype') %>,
config = <%- apply('code.config') %>;
exports.include = include ;
<%- data.libraries.join('\n') %>
<%
    }
%>
<%

    for(let {
        fullName,
        target
    } of codes){
%>
exports['<%- fullName %>'] = <%- target.packageCodeText %>
<%
    }
%>
<%
if(independent === true && bootstrap){
%>
    include('<%- bootstrap %>')(process.argv.slice(3)) ;
<%
}
%>