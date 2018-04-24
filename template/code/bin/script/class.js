<%- apply('code.bin' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %>

<%- data.body %>

module.exports = Main ;