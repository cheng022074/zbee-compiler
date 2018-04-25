<%
    if(data.independent === true){
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
    let {
        codes,
        bootstrap
    } = data ;

    for(let {
        fullName,
        target
    } of codes){
%>
exports['<%- fullName %>'] = <%- target.packageCodeText %>
<%
    }
%>