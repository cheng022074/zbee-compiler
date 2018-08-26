(function(){

    function require(name){

        throw new Error(`无法加载资源 - ${name}`) ;
    }

    <%- data.body %>

}).call(window[<%- data.name %>] = {}) ;