<%- apply('code.bin' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %>
<%- data.imports %>
<%- data.configItems %>

<%

    let {
        paramNames
    } = data ;

    if(data.scoped){
%>
<%- data.body %>
module.exports = <%if(data.async){%>async <%}%>function(<%- data.params %>){

    return <%if(data.async){%>await <%}%>main.call((function(){

        return this === global ? main : this ;

    }).call(this) <%if(paramNames.length){%>, <%- paramNames %><%}else{%><%- paramNames %><%}%>) ;
}
<%
    }else{
%>
<%if(data.async){%>async <%}%>function main(<%- paramNames.join(',') %>){

    <%- data.body %>
}
module.exports = <%if(data.async){%>async <%}%>function(<%- data.params %>){

    return <%if(data.async){%>await <%}%>main.call((function(){

        return this === global ? main : this ;

    }).call(this) <%if(paramNames.length){%>, <%- paramNames %><%}else{%><%- paramNames %><%}%>) ;
}
<%
    }
%>