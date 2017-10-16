{
    let <%- optionsName %> = {};
    {
        const object_set = require('object').set;
        <%- options %>
    }
    <%

        if(varName){
    %>
    <%- varName %> = await require('web.api').input('<%- uri %>' , '<%- method %>' , <%- optionsName %>) ;
    <%}else{%>
    await require('web.api').input('<%- uri %>' , '<%- method %>' , <%- optionsName %>) ;
    <%}%>

}