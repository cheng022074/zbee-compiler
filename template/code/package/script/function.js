(() =>{
    <%- data.importNames %>
    <%- data.configItemNames %>
    <%

        let {
            paramNames,
            once,
            imports,
            configItems
        } = data,
        now = Date.now(),
        onceVarValue = `__once_${now}_value__`,
        onceVarLocked = `__once_${now}_locked__`,
        isFirstExecuted = `__first_executed_${now}__`;
    %>
    <%if(once){%>
    let <%- onceVarValue %>,
        <%- onceVarLocked %> = false;
    <%}%>
    let <%- isFirstExecuted %> = false ;
    <%
    let hasDefinition = imports.length || configItems.length ;
    %>
    <%
        if(data.scoped){
    %>
    <%- data.body %>
    return <%if(data.async){%>async <%}%>function(<%- data.params %>){
        <%
            if(hasDefinition){
        %>
        if(!<%- isFirstExecuted %>){
            <%- imports %>
            <%- configItems %>
            <%- isFirstExecuted %> = true ;
        }
        <%
            }
        %>
        <%if(once){%>
        if(<%- onceVarLocked %>){

            return <%- onceVarValue %> ;

        }
        
        <%- onceVarLocked %> = true ;
        <%}%>
        return <%if(once){%> <%- onceVarValue %> = <%}%><%if(data.async){%>await <%}%>main.call((function(){

            let me = this,
                target;

            if(typeof global !== 'undefined'){

                target = global ;
            
            }else{

                target = window ;
            }

            return me === target ? main : me ;

        }).call(this) <%if(paramNames.length){%>, <%- paramNames %><%}else{%><%- paramNames %><%}%>) ;
    }
    <%
        }else{
    %>
    <%if(data.async){%>async <%}%>function main(<%- paramNames.join(',') %>){

        <%- data.body %>
    }
    return <%if(data.async){%>async <%}%>function(<%- data.params %>){
        <%
            if(hasDefinition){
        %>
        if(!<%- isFirstExecuted %>){
            <%- data.imports %>
            <%- data.configItems %>
            <%- isFirstExecuted %> = true ;
        }
        <%
            }
        %>
        <%if(once){%>
        if(<%- onceVarLocked %>){

            return <%- onceVarValue %> ;

        }

        <%- onceVarLocked %> = true ;
        <%}%>
        return <%if(once){%><%- onceVarValue %> = <%}%> <%if(data.async){%>await <%}%>main.call((function(){

            let me = this,
                target;

            if(typeof global !== 'undefined'){

                target = global ;
            
            }else{

                target = window ;
            }

            return me === target ? main : me ;

        }).call(this) <%if(paramNames.length){%>, <%- paramNames %><%}else{%><%- paramNames %><%}%>) ;
    }
    <%
        }
    %>

})() ;