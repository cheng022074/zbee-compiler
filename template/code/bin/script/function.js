<%- apply('code.bin' , {
    defaultFolder:data.defaultFolder
}) %>
<%- data.importNames %>
<%- data.configItemNames %>

<%

    let {
        paramNames,
        once
    } = data,
    now = Date.now(),
    onceVarValue = `__once_${now}_value__`,
    onceVarLocked = `__once_${now}_locked__`;
%>
<%if(once){%>
let <%- onceVarValue %>,
    <%- onceVarLocked %> = false;
<%}%>
<%
    if(data.scoped){
%>
<%- data.body %>
module.exports = <%if(data.async){%>async <%}%>function(<%- data.params %>){
    <%- data.imports %>
    <%- data.configItems %>
    <%if(once){%>
    if(<%- onceVarLocked %>){

        return <%- onceVarValue %> ;

    }
    
    <%- onceVarLocked %> = true ;
    <%}%>
    return <%if(once){%> <%- onceVarValue %> = <%}%><%if(data.async){%>await <%}%>main.call((function(){

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
    <%- data.imports %>
    <%- data.configItems %>
    <%if(once){%>
    if(<%- onceVarLocked %>){

        return <%- onceVarValue %> ;

    }

    <%- onceVarLocked %> = true ;
    <%}%>
    return <%if(once){%><%- onceVarValue %> = <%}%> <%if(data.async){%>await <%}%>main.call((function(){

        return this === global ? main : this ;

    }).call(this) <%if(paramNames.length){%>, <%- paramNames %><%}else{%><%- paramNames %><%}%>) ;
}
<%
    }
%>