const include = <%- apply('code.package.header.include' , {
    defaultFolder:data.defaultFolder
}) %>,
gettype = <%- apply('code.gettype') %>,
config = <%- apply('code.config') %>;

<%
    let {
        codes
    } = data ;

    for(let {
        fullName,
        target
    } of codes){
%>
exports[<%- fullName %>] = <%- target.packageCodeText %>
<%
    }
%>