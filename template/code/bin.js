global.include = <%- apply('code.bin.header.include' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %> ;

global.gettype = <%- apply('code.gettype') %> ;

global.config = <%- apply('code.config') %> ;

<%- apply('code.process') %>