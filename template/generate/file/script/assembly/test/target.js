exports['<%- name %>'] = async function(){

    try{

        <%- code %>

        console.log('成功' , '<%- name %>') ;

    }catch(err){

        console.log('失败' , '<%- name %>') ;

        console.log(err) ;
    }
}