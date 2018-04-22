(() =>{

    <%- data.imports %>
    <%- data.configItems %>
    
    <%

        let {
            paramNames,
            once
        } = data,
        onceVarName = `__${Date.now()}__`;

        if(data.scoped){
    %>
    <%- data.body %>
    let <%- onceVarName %>;
    return <%if(data.async){%>async <%}%>function(<%- data.params %>){
        <%if(once){%>
        if(typeof <%- onceVarName %> !== 'undefined'){
    
            return <%- onceVarName %> ;
    
        }
        <%}%>
    
        return <%- onceVarName %> = <%if(data.async){%>await <%}%>main.call((function(){
    
            return this === global ? main : this ;
    
        }).call(this),<%- paramNames %>) ;
    }
    <%
        }else{
    %>
    <%if(data.async){%>async <%}%>function main(<%- paramNames.join(',') %>){
    
        <%- data.body %>
    }
    return <%if(data.async){%>async <%}%>function(<%- data.params %>){
    
        return <%if(data.async){%>await <%}%>main.call((function(){
    
            return this === global ? main : this ;
    
        }).call(this) <%if(paramNames.length){%>, <%- paramNames %><%}else{%><%- paramNames %><%}%>) ;
    }
    <%
        }
    %>

})() ;