const include = <%- apply('code.package.header.include' , {
    defaultFolder:data.defaultFolder
}) %>,
gettype = <%- apply('code.gettype') %>,
config = <%- apply('code.package.header.config') %>;
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