<%
    if(data.node === true){
%>
const include = <%- apply('code.package.header.include' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %>,
gettype = <%- apply('code.gettype') %>,
config = <%- apply('code.config') %>;
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