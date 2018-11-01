module.exports = {
    type:'scss',
    data:`<%- data.meta.code.replace(/\`/g , '\\`') %>`,
    main(){

        console.log(this.data) ;
    }
} ;
