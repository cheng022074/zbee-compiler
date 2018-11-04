module.exports = {
    type:'css',
    data:`<%- data.meta.code.replace(/\`/g , '\\`') %>`,
    main(){

        console.log(this.data) ;
    }
} ;
