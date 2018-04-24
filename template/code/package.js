<%
    if(data.independent === true){
%>
const include = <%- apply('code.package.header.include' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %>,
gettype = <%- apply('code.gettype') %>,
config = <%- apply('code.config') %>;
exports.include = include ;
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