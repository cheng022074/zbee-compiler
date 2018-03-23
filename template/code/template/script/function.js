<%
    let {
        description,
        params,
        returnType
    } = data ;

    if(description){
%>
/**
 * 
 * <%- description %>
 * 
 * <%for(let {name , type , description} of params){%>
 * @param {<%- type %>} <%- name %> <%- description %>
 * <%}%>
 * <%if(returnType){%>
 * @return {<%- returnType %>} 
 * <%}%>
 */

 // 代码实现
<%
    }else{
%>
/**
 * 
 * 函数实现说明
 * 
 * @param {mixed} data 参数说明
 * 
 * @return {mixed} 返回说明 
 * 
 */

 // 代码实现
<%
    }
%>