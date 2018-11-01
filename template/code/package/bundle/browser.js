<%
    const {
        map,
        config,
        defaultFolder
    } = data,
    {
        keys
    } = Object;
%>


export const exports = {} ;

export const include = <%- apply('code.package.header.include' , {
    defaultFolder
}) %> ;


const gettype = <%- apply('code.gettype') %> ;

const config = <%- apply('code.package.header.config.browser' , config) %>;

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

export const <%- alias %> = exports['<%- alias %>'] = include('<%- name %>') ;

<%
        }
%>
<%
    }
%>