<%- apply('code.bin' , {
    defaultFolder:data.defaultFolder
}) %>
const {
    deepStrictEqual,
    notDeepStrictEqual  
} = require('assert') ;

<%- data.body %>