exports.include = <%- apply('code.bin.header.include' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %> ;

exports.gettype = <%- apply('code.gettype') %> ;

exports.config = <%- apply('code.config') %> ;