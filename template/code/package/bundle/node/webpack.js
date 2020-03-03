const innerExports = {} ;

<%
    const {
        defaultFolder,
        codeMap,
        config,
        bootstrap,
        main
    } = data ;
%>

const config = <%- apply('code.package.header.config.node' , config) ;%>;

export const override = <%- apply('code.package.header.override' , defaultFolder) ;%>;

const mixins = <%- apply('code.mixins') ;%>;

<%
    if(!main && !bootstrap){
%>
export const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;
<%
    }else{
%>
const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;
<%
    }
%>

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

<%- apply('code.package.header.main.webpack' , main)%>

<%- apply('code.package.header.bootstrap' , bootstrap)%>