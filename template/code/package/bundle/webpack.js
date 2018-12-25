const exports = {} ;

<%
    const {
        defaultFolder,
        codeMap,
        config
    } = data ;
%>

const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;

const config = <%- apply('code.package.header.config.browser' , config) ;%>;

<%
    const {
        keys
    } = Object;
%>

<%

    let names = keys(codeMap) ; 

    for(let name of names){

        let {
            functionName,
            code
        } = codeMap[name] ;

%>
export const  <%- functionName %> = exports['<%- name %>'] = <%- code %>;
<%
    }
%>