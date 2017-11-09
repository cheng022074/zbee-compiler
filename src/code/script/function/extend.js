module.exports = name =>{

    if(name){

        return `const super = include('${name}');` ;
    }

    return '' ;
}