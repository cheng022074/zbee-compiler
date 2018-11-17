const {
    getElementAttributes:getXMLElementAttributes,
    getElementChildren:getXMLElementChildren,
    getElementTagName:getXMLElementTagName
} = require('../xml'),
{
    getElementAttributes:getHTMLElementAttributes,
    getElementChildren:getHTMLElementChildren,
    getElementTagName:getHTMLElementTagName
} = require('../html'),
ELEMENTS = [];

module.exports = class {

    static create(tagName , attributes , children){

    }

    static createByHTML(el){

        const 
        me = this,
        {
            create
        } = me ;

        return create(getHTMLElementTagName(el) , getHTMLElementAttributes(el) , create_elements.call(me , 'createByHTML' , getHTMLElementChildren(el))) ;
    }

    static createByXML(rootEl){

        const
        me = this,
        {
            create
        } = me ;

        return create(getXMLElementTagName(el) , getXMLElementAttributes(el) , create_elements.call(me , 'createBYXML' , getXMLElementChildren(el))) ;
    }

    constructor(tagName , attributes){

        let me = this ;

        me.tagName = tagName ;

        me.attributes = attributes ;
    }

    getAttributeNames(){

        return Object.keys(this.attributes) ;
    }

    set(name , value){

        let me = this ;

        if(me.get(name) !== value){

            me.attributes[name] = value ;

            me.changedAttributes[name] = value ;
        }
    }

    get(name){

        return this.attributes[name] ;
    }

    recovery(){


    }

}

function create_elements(methodName , els){

    const method = this[methodName] ;

    let result = [] ;

    for(let el of els){

        result.push(el) ;
    }

    return result ;
}