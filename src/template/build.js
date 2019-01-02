const {
    BinCode
} = require('../code') ;

function createElementFromData({
    tag,
    attributes,
    children
} , name = 'template.element'){

    return BinCode.get(name).target.createElement(tag , attributes , children.map(itemData => createElementFromData(itemData , name))) ;
}


module.exports = createElementFromData ;