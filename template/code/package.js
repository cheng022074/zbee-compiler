<%
    const {
        independent,
        browser,
        bootstrap,
        codes,
        aliasMap
    } = data ;
    if(independent === true){
%>
try{

    process.env['ZBEE-APPLICATION-ROOT-PATH'] = __dirname ;

}catch(err){

}
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
    let aliasNames = Object.keys(aliasMap) ;

    for(let aliasName of aliasNames){
%>
exports['<%- aliasName %>'] = include('<%- aliasMap[aliasName] %>') ;
<%
    }
%>
<%
if(independent === true && bootstrap){
%>
    include('<%- bootstrap %>')(process.argv.slice(2)) ;
<%
}
%>