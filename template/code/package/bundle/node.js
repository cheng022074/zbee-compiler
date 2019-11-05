<%
    const {
        defaultFolder,
        codeMap,
        config,
        bootstrap,
        main
    } = data ;

%>

const innerExports = {} ;

try{
    const {
        env
    } = process ;
    
    if(!env['ZBEE-APP-PATH']){
    
        env['ZBEE-APP-PATH'] = __dirname ;
    }
    
}catch(err){

}

const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;

const mixins = <%- apply('code.mixins') ;%>;

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
innerExports['<%- name %>'] = <%- codeMap[name] %>;
<%
    }
%>

<%- apply('code.package.header.main' , main)%>

<%- apply('code.package.header.bootstrap' , bootstrap)%>
