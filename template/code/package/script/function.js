(() =>{

    <%- data.imports %>
    <%- data.configItems %>
    
    <%
        if(data.scoped){
    %>
    <%- data.body %>
    return <%if(data.async){%>async <%}%>function(<%- data.params %>){
    
        return <%if(data.async){%>await <%}%>main.call((function(){
    
            return this === global ? main : this ;
    
        }).call(this),<%- data.paramNames %>) ;
    }
    <%
        }else{
    
        let {
            paramNames
        } = data ;
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