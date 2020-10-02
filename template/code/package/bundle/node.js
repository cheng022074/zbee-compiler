<%
    const {
        defaultFolder,
        codeMap,
        config,
        bootstrap,
        main,
        api
    } = data ;

%>

const innerExports = {} ;

const {
    env
} = process ;

if(!env['ZBEE-APP-PATH']){

    env['ZBEE-APP-PATH'] = __dirname ;
}

const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;

const mixins = <%- apply('code.mixins') ;%>;

<%
    if(!main && !bootstrap && !api){
%>
exports.include = include ;
<%
    }
%>

const config = <%- apply('code.package.header.config.node' , config) ;%>;

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

<%

    if(main){

%>

<%- apply('code.package.header.main.node' , main)%>

<%
    }
%>

<%

    if(bootstrap){
%>

<%- apply('code.package.header.bootstrap' , bootstrap)%>

<%
    }
%>

<%
    if(api){
%>

<%- apply('code.package.header.api.node' , api)%>


<%
    }
%>
