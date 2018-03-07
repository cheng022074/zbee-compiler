constructor(){

    <%- apply('code.generate.function.overload' , {
        functions:data.constructors
    }) %>
}