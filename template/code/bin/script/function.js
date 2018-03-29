<%- apply('code.bin' , {
    defaultFolder:data.defaultFolder
}) %>
<%- data.imports %>

<%
    if(data.scoped){
%>
<%- data.body %>
module.exports = function(<%- data.params %>){

    return main.call((() =>() =>{

        return this === global ? main : this ;

    }).call(this),<%- data.paramNames %>) ;
}
<%
    }else{

    let {
        paramNames
    } = data ;
%>
function main(<%- paramNames.join(',') %>){

    <%- data.body %>
}
module.exports = function(<%- data.params %>){

    return main.call((function(){

        return this === global ? main : this ;

    }).call(this) <%if(paramNames.length){%>, <%- paramNames %><%}else{%><%- paramNames %><%}%>) ;
}
<%
    }
%>