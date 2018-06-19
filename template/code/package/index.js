<%
    const {
        bootstrap,
        codeMap,
        aliasMap,
        config,
        defaultFolder,
        browser
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
        config,
        browser
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

<% if(browser !== true){%>

<%- apply('code.process' , {
    bootstrap
}) %>

<%}%>