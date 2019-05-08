<%
    const {
        defaultFolder,
        codeMap,
        config,
        bootstrap,
        main
    } = data ;
%>

{
    const {
        env
    } = process ;
    
    if(!env['ZBEE-APP-PATH']){
    
        env['ZBEE-APP-PATH'] = __dirname ;
    }
}

const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;

<%
    if(!main && !bootstrap){
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
exports['<%- name %>'] = <%- codeMap[name] %>;
<%
    }
%>

<%
if(main){
%>

<%- apply('code.package.header.main' , main)%>

<%}else{%>

<%- apply('code.package.header.bootstrap' , bootstrap)%>

<%}%>