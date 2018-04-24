const include = global.include = <%- apply('code.bin.header.include' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %>,
gettype = global.gettype = <%- apply('code.gettype') %>,
config = global.config = <%- apply('code.bin.header.config') %>;