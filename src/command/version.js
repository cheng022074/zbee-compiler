module.exports = () =>{

    console.log(process.env['ZBEE-ENV']) ;

    console.log(require('../../package.json').version) ;
}