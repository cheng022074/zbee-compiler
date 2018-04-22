<%- apply('code.bin' , {
    defaultFolder:data.defaultFolder
}) %>
const {
    deepStrictEqual,
    notDeepStrictEqual,
    notStrictEqual  
} = require('assert') ;

<%- data.body %>