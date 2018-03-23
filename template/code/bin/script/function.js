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
%>
function main(<%- data.paramNames %>){

    <%- data.body %>
}
module.exports = function(<%- data.params %>){

    return main.call((function(){

        return this === global ? main : this ;

    }).call(this) , <%- data.paramNames %>) ;
}
<%
    }
%>