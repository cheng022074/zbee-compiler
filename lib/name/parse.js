const splitRe = /\:{2}/ ;

module.exports = (name , defaultFolder = 'src') => {

    let items = name.split(splitRe) ;

    switch(items.length){

        case 1:

            return {
                folder:defaultFolder,
                name
            } ;

        case 2:

            return {
                folder:items[0],
                name:items[1]
            } ;
    }
}