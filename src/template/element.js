const {
    clone:array_clone,
    remove,
    clear:array_clear,
    replace
} = require('../array'),
{
    clear:object_clear,
    clone:object_clone
} = require('../object'),
{
    string:isString
} = require('../is'),
{
    BinCode
} = require('../code'),
{
    get
} = require('../config'),
{
    keys
} = Object;

const unusedElements = {} ;

class Element {

    /**
     * 
     * 在配置中文件名称
     * 
     */
    static get resource(){

        return 'template' ;
    }

    static createElement(tag , attributes , children){

        const CurrentElement = this ;

        let name = get(CurrentElement.resource , tag) ;

        if(name){

            let {
                target
            } = BinCode.get(name) ;

            if(target){

                const Tag = target() ;

                if(Tag.prototype instanceof Element){

                    return Tag.create(tag , attributes , children) ;
                }
            }
        }

        return new CurrentElement(tag , attributes , children) ;

    }

    /**
     * 
     * 命名空间
     * 
     */
    static get namespace(){

        return 'primitive' ;
    }

    static getFullTag(tag){

        return `${this.namespace}::${tag}` ;
    }

    /**
     * 
     * 创建一个指定元素类型的元素
     * 
     * @param {string} tag 元素名称 
     * 
     * @param {object} attributes 属性集合
     * 
     * @param {array} children 子元素集合
     * 
     * @return {Element}
     * 
     */
    static create(tag , attributes , children){

        const Element = this ;

        let fullTag = Element.getFullTag(tag) ;

        if(unusedElements.hasOwnProperty(fullTag)){

            let elements = unusedElements[fullTag] ;

            if(elements.length){

                return elements.shift() ;
            }
        }

        return new Element(tag) ;
    }

    /**
     * 
     * 删除指定元素
     * 
     * @param {Element} el 元素
     */
    static destroy(el){

        el.destroy() ;

        let {
            fullTag
        } = el ;

        if(!unusedElements.hasOwnProperty(fullTag)){

            unusedElements[fullTag] = [] ;
        }

        unusedElements[fullTag].push(el) ;
    }

    /**
     * 
     * 构建一个新的元素
     * 
     * @param {string} tag 元素名称 
     */
    constructor(tag){

        let me = this ;

        me.tag = tag ;

        me.$attributes = {} ;

        me.$children = []  ;
    }

    queryAll(tag){

        let {
            $children
        } = this,
        result = [];

        for(let el of $children){

            if(el.tag === tag){

                result.push(el) ;
            }
        }

        return result ;
    }

    excludeQueryAll(tag){

        let {
            $children
        } = this,
        result = [];

        for(let el of $children){

            if(el.tag !== tag){

                result.push(el) ;
            }
        }

        return result ;
    }

    get fullTag(){

        let {
            __proto__,
            tag
        } = this ;

        return __proto__.getFullTag(tag) ;
    }

    /**
     * 
     * @property {object} 属性对象
     * 
     */

    set attributes(attributes){

       this.$attributes = attributes ;
    }

    get attributes(){

       return object_clone(this.$attributes) ;
    }

    /**
     * 
     * 设置属性值
     * 
     * @param {string} name 属性名称
     *  
     * @param {mixed} value 属性值
     * 
     * @return {boolean} 如果设置值成功则返回 true , 否则返回 false
     * 
     */
    setAttriute(name , value){

        let me = this;

        me.$attributes[name] = value ;

    }

    /**
     * 
     * 移除属性
     * 
     * @param {string} name 属性名称
     *  
     */
    removeAttribute(name){

        delete this.$attributes[name] ;
    }

    /**
     * 
     * 获取属性值
     * 
     * @param {string} name 属性名称
     * 
     * @return {mixed} 属性值
     * 
     */
    getAttribute(name){

        let me = this,{
            $attributes
        } = me ;

        if(me.hasAttribute(name)){

            return $attributes[name] ;
        }

        return null;
    }

    /**
     * 
     * 判断是否拥有属性名称
     * 
     * @param {string} name 属性名称
     * 
     * @return {boolean}
     * 
     */
    hasAttribute(name){

        return this.$attributes.hasOwnProperty(name) ;
    }

    /**
     * 
     * @property {array} 子元素数组
     * 
     */
    set children(children){

        let 
        me = this,
        {
            $children:currentChildren
        } = me,
        len = currentChildren.length;

        for(let i = 0 ; i < len ; i ++){

            let currentChildEl = currentChildren[i],
                childEl = children[i] ;

            if(childEl){

                if(currentChildEl.tag === childEl.tag){

                    currentChildEl.attributes = childEl.attributes ;

                    currentChildEl.children = childEl.children ;

                }else{

                    me.replaceChild(childEl , currentChildEl) ;
                }

            }else{

                me.removeChild(currentChildEl) ;
            }
        }
    }

    get children(){

        return array_clone(this.$children) ;
    }

    /**
     * 
     * 是否拥有子元素
     * 
     * @param {boolean}
     * 
     */
    get hasChildren(){

        return !!this.$children.length ;
    }

    /**
     * 
     * 添加一个子元素
     * 
     * @param {Element} 子元素
     * 
     */
    appendChild(el){

        let {
            $children
        } = this ;

        $children.push(el) ;
    }

    /**
     * 
     * 替换子元素
     * 
     * @param {Element} replaceEl 新替换的元素
     * 
     * @param {Element} el 被替换的元素
     * 
     * @return {boolean} 替换成功返回 true , 否则返回 false
     * 
     */
    replaceChild(replaceEl , el){

        let {
            $children
        } = this ;

        if(replace($children , replaceEl , el)){

            Element.destroy(el) ;

            return true ;
        }

        return false ;
    }

    /**
     * 
     * 删除一个子元素
     * 
     * @param {Element} 子元素
     * 
     * @return {boolean} 如果删除失败则返回 true ， 否则返回 false
     * 
     */
    removeChild(el){

        let {
            $children
        } = this ;

        remove($children , el) ;

        Element.destroy(el) ;

        return true ;
    }

    /**
     * 
     * 销毁当前元素
     * 
     */
    destroy(){

        let {
            $attributes,
            $children
        } = this ;

        array_clear($children) ;

        object_clear($attributes) ;
    }

    /**
     * 
     * 当前元素的序列化 
     * 
     * @return {string}
     * 
     */
    toString(){

        let me = this,
            result = me.render();

        if(isString(result)){

            return result ;
        
        }else if(result instanceof Element){

            return result.toString();
        }

        return '' ;
    }

    /**
     * 
     * 当前元素的渲染机
     * 
     */
    render(){

        return '' ;
    }

}

module.exports = Element ;