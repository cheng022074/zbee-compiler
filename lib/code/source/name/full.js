const fullNameRe = /^[^\:]+\:{2}[^\:]+$/ ;

module.exports = (name , folder = 'src') => {

    if(fullNameRe.test(name)) {

        return ;
    }

    return `${folder}::${name}` ;

} ;