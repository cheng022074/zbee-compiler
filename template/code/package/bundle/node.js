<%
    const {
        defaultFolder,
        codeMap,
        config,
        bootstrap
    } = data ;
%>

{
    const {
        env
    } = process ;
    
    if(!env['ZBEE-APPLICATION-ROOT-PATH']){
    
        env['ZBEE-APPLICATION-ROOT-PATH'] = __dirname ;
    }
}

const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;

const config = <%- apply('code.package.header.config.server' , config) ;%>;

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

<%- apply('code.package.header.boostrap' , boostrap) ;%>;