const exports = {} ;

<%
    const {
        defaultFolder,
        codeMap,
        config
    } = data ;
%>

export const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;

const config = <%- apply('code.package.header.config.browser' , config) ;%>;

export const override = <%- apply('code.package.header.override') ;%>;

<%
    const {
        keys
    } = Object;
%>

<%

    let names = keys(codeMap) ; 

    for(let name of names){

%>
exports['<%- name %>'] = <%- codeMap[name] %>;
<%
    }
%>