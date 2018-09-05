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

<%
if(!browser){
%>

const {
    env
} = process ;

if(!env['ZBEE-APPLICATION-ROOT-PATH']){

    env['ZBEE-APPLICATION-ROOT-PATH'] = __dirname ;
}

<%
}else{
%>
const exports = {} ;
<%
}
%>

<%if(browser){%>

export const include = <%- apply('code.package.header.include' , {
    defaultFolder
}) %> ;

<%}else{%>

const include = <%- apply('code.package.header.include' , {
    defaultFolder
}) %>

exports.include = include ;

<%}%>

const gettype = <%- apply('code.gettype') %> ;

const config = <%- apply('code.package.header.config' , {
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
    <%if(browser){%>

        export function <%- name %>(...args){

            return exports['<%- name %>'](...args) ;

        };
    <%}%>
<%
    }
%>

<%

if(!browser && bootstrap){
%>
    include('<%- bootstrap %>')(process.argv.slice(2)) ;
<%
}
%>