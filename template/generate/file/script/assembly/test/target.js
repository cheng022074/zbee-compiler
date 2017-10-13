exports['<%- name %>'] = async function(){

    <%
        if(start){
    %>
    await exports['<%- start %>']() ;
    <%
        }
    %>

    try{

        <%- code %>

        console.log('成功' , '<%- name %>') ;

    }catch(err){

        console.log('--------------------------------------') ;

        console.log(err) ;

        console.log('失败' , '<%- name %>') ;

        console.log('--------------------------------------') ;
    }

    <%
        if(end){
    %>
    await exports['<%- end %>']() ;
    <%
        }
    %>
}