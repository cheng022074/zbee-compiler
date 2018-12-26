<%

    if(data){

        let {
            name,
            types
        } = data ;

%>

    {
        let {
            argv
        } = process ;

        argv = argv.slice(2) ;

        let values = [],
            len = types.length;

        for(let i = 0 ; i < len ; i ++){

            let value = argv[i],
                type = types[i];

            if(typeof value === 'string'){

                try{

                    values.push(include(`string.to.${type}`)(value)) ;
                
                }catch(err){

                    values.push(value) ;
                }
            }
        }

        include('<%- name %>')(...values) ;
    }

<%
    }
%>