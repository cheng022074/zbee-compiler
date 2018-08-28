<%- data.polyfill %>

(function(exports){

    function require(name){

        throw new Error('无法加载资源 - ' + name) ;
    }

    <%

        let {
            compress,
            body,
            min,
            format
        } = data ;
    %>

    <%if(compress){%>

    <%- min(body) %>
    
    <%}else{%>
    
    <%- format(body) %>

    <%}%>

})(window['<%- data.name %>'] = {}) ;