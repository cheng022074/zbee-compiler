<%- apply('code.bin' , {
    defaultFolder:data.defaultFolder
}) %>
const {
    deepStrictEqual  
} = require('assert') ;

<%- data.body %>