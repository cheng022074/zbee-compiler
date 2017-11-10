const {
    assert,
    equal,
    deepEqual,
    deepStrictEqual,
    notEqual,
    notDeepEqual,
    notDeepStrictEqual,
    ok
} = require('assert') ;

module.exports = (<%- params %>) =>{

    <%- imports %>

    <%- configs %>

    <%- extend %>

    <%- code %>
} ;