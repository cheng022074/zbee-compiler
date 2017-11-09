module.exports = name =>{

    if(name){

        return `const __super__ = include('${name}');` ;
    }

    return '' ;
}