const innerExports = {} ;

<%
    const {
        defaultFolder,
        codeMap,
        config
    } = data ;
%>

export const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;

const config = <%- apply('code.package.header.config.browser' , config) ;%>;

export const override = <%- apply('code.package.header.override' , defaultFolder) ;%>;

const mixins = <%- apply('code.mixins' , config) ;%>;

<%
    const {
        keys
    } = Object;
%>

<%

    let names = keys(codeMap) ; 

    for(let name of names){

%>
innerExports['<%- name %>'] = <%- codeMap[name] %>;
<%
    }
%>