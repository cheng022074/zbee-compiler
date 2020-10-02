{
    let {
        argv
    } = process ;

    include('<%- data %>')(...argv.slice(2)) ;
}