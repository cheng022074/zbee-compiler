exports['<%- name %>'] = async function(){

    <%
        if(start){
    %>
    await exports['<%- start %>']() ;
    <%
        }
    %>

    try{

        console.log('--------------------------------------') ;

        <%- code %>

        console.log('成功' , '<%- name %>') ;

        console.log('--------------------------------------') ;

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