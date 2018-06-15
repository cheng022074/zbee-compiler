<%
    const {
        bootstrap,
        codeMap,
        aliasMap,
        config,
        defaultFolder
    } = data,
    {
        keys
    } = Object;
%>

try{

    let {
        env
    } = process ;

    if(!env['ZBEE-APPLICATION-ROOT-PATH']){

        env['ZBEE-APPLICATION-ROOT-PATH'] = __dirname ;
    }

}catch(err){

}

const include = <%- apply('code.package.header.include' , {
    defaultFolder
}) %> ;

exports.include = include ;

const gettype = <%- apply('code.gettype') %> ;

const config = <%- apply('code.config' , {
        config
    }) %>;

<%

    let codeNames = keys(codeMap) ; 

    for(let name of codeNames){
%>
exports['<%- name %>'] = <%- codeMap[name] %>
<%
    }
%>
<%
    let aliasNames = Object.keys(aliasMap) ;

    for(let name of aliasNames){
%>
exports['<%- name %>'] = include('<%- aliasMap[name] %>') ;
<%
    }
%>
<%- apply('code.process') %>
<%
if(bootstrap){
%>
    include('<%- bootstrap %>')(process.argv.slice(2)) ;
<%
}
%>