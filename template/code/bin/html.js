module.exports = {
    type:'html',
    data:`<%- data.meta.code.replace(/\`/g , '\\`') %>`,
    main(){

        return console.log(this.data) ;
    }
} ;
