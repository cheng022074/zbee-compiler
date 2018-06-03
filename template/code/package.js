<%
    const {
        bootstrap,
        codes,
        aliasMap,
        config
    } = data ;
%>

<%- data.libraries.join('\n') %>

try{

    let {
        env
    } = process ;

    if(!env['ZBEE-APPLICATION-ROOT-PATH']){

        env['ZBEE-APPLICATION-ROOT-PATH'] = __dirname ;
    }

}catch(err){

}

if(typeof include !== 'function'){

    var include = <%- apply('code.package.header.include' , {
        defaultFolder:data.defaultFolder
    }) %> ;

    exports.include = include ;
}

if(typeof gettype !== 'function'){

    var gettype = <%- apply('code.gettype') %> ;
}

if(typeof config !== 'function'){

    var config = <%- apply('code.config' , {
        config
    }) %>;

}

<%

    for(let {
        fullName,
        target
    } of codes){

        if(!target){

            continue ;
        }
%>
exports['<%- fullName %>'] = <%- target.packageCodeText %>
<%
    }
%>
<%
    let aliasNames = Object.keys(aliasMap) ;

    for(let aliasName of aliasNames){
%>
exports['<%- aliasName %>'] = include('<%- aliasMap[aliasName] %>') ;
<%
    }
%>
<%
if(bootstrap){
%>
    include('<%- bootstrap %>')(process.argv.slice(2)) ;
<%
}
%>