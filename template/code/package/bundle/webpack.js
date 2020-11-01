/* eslint-disable */

const innerExports = {} ;

<%
    const {
        defaultFolder,
        codeMap,
        config,
        entry,
        exports
    } = data ;
%>

export const include = <%- apply('code.package.header.include' , defaultFolder) ;%>;

const config = <%- apply('code.package.header.config.browser' , config) ;%>;

export const override = <%- apply('code.package.header.override' , defaultFolder) ;%>;

const mixins = <%- apply('code.mixins') ;%>;

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
    if(entry){
%>
export default (...args) => include('<%- entry %>')(...args) ;
<%
    }
%>

<%
    if(exports){

        let names = Object.keys(exports) ;

        for(let name of names){
%>
export function <%- name %>(...args){
    
    return include('<%- exports[name] %>')(...args) ;
}
<%
        }
    }
%>