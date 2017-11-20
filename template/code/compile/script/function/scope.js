module.exports = (() =>{

    <%- requires %>
    
    <%- imports %>

    <%- configs %>

    <%- code %>

<%
    if(!async){
%>

    return function(<%- params %>){

        return main.apply(undefined , arguments) ;
    } ;
<%
    }else{
%>
    return async function(<%- params %>){

        return await main.apply(undefined , arguments) ;
    } ;
<%
    }
%>

})() ;