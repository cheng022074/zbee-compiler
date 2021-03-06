<%
    const {
        defaultFolder,
        codeMap,
        config,
        name
    } = data ;
%>

window['<%- name %>'] = (() =>{

    const exports = {} ;

    const include = exports.include = <%- apply('code.package.header.include' , defaultFolder) ;%>;

    const config = <%- apply('code.package.header.config.browser' , config) ;%>;

    const override = exports.override = <%- apply('code.package.header.override' , defaultFolder) ;%>;

    const mixins = <%- apply('code.mixins') ;%>;

    const innerExports = {} ;

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

    return exports ;

})() ;