const enterRe = /\r|\n/g,
      squotRe = /\'/g,
      dquotRe = /\"/g;

module.exports = value =>{

    return value.replace(enterRe , '').replace(squotRe , '\\').replace(dquotRe , '\\"').trim() ;
}