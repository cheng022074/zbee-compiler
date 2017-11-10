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

    <%- requires %>

    <%- imports %>

    <%- configs %>

    <%- extend %>

    <%- code %>
} ;