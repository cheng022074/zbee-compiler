module.exports = name =>{

    if(name){

        return `const parent = include('${name}');` ;
    }

    return '' ;
}