const include = <%- apply('code.bin.header.include' , {
    defaultFolder:data.defaultFolder,
    libraries:data.libraries
}) %>,
gettype = <%- apply('code.gettype') %>,
config = <%- apply('code.config') %>;

global.zbee_include = include ;