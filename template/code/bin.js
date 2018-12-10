global.include = <%- apply('code.bin.header.include' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %> ;

global.config = <%- apply('code.bin.header.config') %> ;