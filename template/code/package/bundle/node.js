<%
    const {
        defaultFolder,
        codeMap,
        config,
        bootstrap,
        main
    } = data ;

%>

<%
    if(main || bootstrap){
%>
const exports = {} ;
<%
    }
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

<%- apply('code.package.header.main' , main)%>

<%- apply('code.package.header.bootstrap')%>
