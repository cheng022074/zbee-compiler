<%
    const {
        bootstrap,
        map,
        config,
        defaultFolder
    } = data,
    {
        keys
    } = Object;
%>

const {
    env
} = process ;

if(!env['ZBEE-APPLICATION-ROOT-PATH']){

    env['ZBEE-APPLICATION-ROOT-PATH'] = __dirname ;
}

const include = <%- apply('code.package.header.include' , {
    defaultFolder
}) %>

exports.include = include ;

const gettype = <%- apply('code.gettype') %> ;

const config = <%- apply('code.package.header.config.server' , config) %>;

<%

    let names = keys(map) ; 

    for(let name of names){

        let {
            code,
            aliases
        } = map[name] ;
%>
exports['<%- name %>'] = <%- code %>
<%
        for(let alias of aliases){
%>
exports['<%- alias %>'] = include('<%- name %>') ;
<%
        }
%>
<%
    }
%>

<%

if(bootstrap){
%>
    include('<%- bootstrap %>')(process.argv.slice(2)) ;
<%
}
%>