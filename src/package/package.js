const {
    apply
} = require('../template'),
{
    assign
} = Object;

module.exports = (name , metas , files , version , {
    engines,
    author,
    license
}) => {

    let importAllNames = Object.keys(metas),
        dependencies = {};

    for(let name of importAllNames){

        assign(dependencies , metas[name].dependentModules) ;
        
    }

    return apply('code.package.package' , {
        name:getPackageName(name),
        files,
        version,
        engines,
        author,
        license,
        dependencies
    }) ;
} ;

function getPackageName(name){

    return name.replace(/\-/g , '_').toLowerCase() ;
}