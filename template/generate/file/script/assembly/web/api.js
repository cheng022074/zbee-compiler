{
    const options = {},
          object_set = require('object').set;
    <%- options.join('\n') %>
    <%

        if(varName){
    %>
    <%- varName %> = await require('web.api').input('<%- uri %>' , '<%- method %>' , options) ;
    <%}else{%>
    await require('web.api').input('<%- uri %>' , '<%- method %>' , options) ;
    <%}%>

}