const suffixRe = /\.[^\\\/]+$/ ;

module.exports = path => {

    let [
        suffix
    ] = path.match(suffixRe) ;

    return suffix ;
}