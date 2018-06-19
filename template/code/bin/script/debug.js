<%- data.importNames %>
<%- data.configItemNames %>

<%

    let now = Date.now(),
        isFirstExecuted = `__first_executed_${now}__`;
%>

let <%- isFirstExecuted %> = false ;

async function main(){

    <%- data.body %>
}
module.exports = async function(){
    if(!<%- isFirstExecuted %>){
        <%- data.imports %>
        <%- data.configItems %>
        <%- isFirstExecuted %> = true ;
    }
  
    await main.call((function(){

        return this === global ? main : this ;

    }).call(this)) ;
}