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

const mixins = <%- apply('code.mixins' , config) ;%>;

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
