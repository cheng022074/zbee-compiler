module.exports = (targetPath , parentPath) =>{

    return targetPath.replace(parentPath , '') !== targetPath ;
}