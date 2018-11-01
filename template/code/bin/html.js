module.exports = {
    type:'html',
    data:`<%- data.meta.code.replace(/\`/g , '\\`') %>`,
    main(){

        console.log(this.data) ;
    }
} ;
