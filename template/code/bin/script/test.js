<%- apply('code.bin' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %>
const {
    deepStrictEqual,
    notDeepStrictEqual,
    notStrictEqual  
} = require('assert') ;

<%- data.body %>