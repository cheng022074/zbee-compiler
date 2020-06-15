const suffixRe = /\.[^\\\/]+$/ ;

module.exports = path => path.replace(suffixRe , '') ;