const placeholderTestRe = /\{[^\{\}]+\}/;

function init(el){

    let structure = {
            tag:el.tagName.toLowerCase()
        } ;

    let attrs = {},
        mv = {},
        vm = {};

    let {
        attributes,
        children
    } = el ;

    for(let attribute of attributes){

        let value = encode(attribute.value),
            name = attribute.name;

        attrs[name] = value ;

        if(placeholderTestRe.test(value)){

            name = `attr::${name}` ;

            vm[name] = value ;

            mv_set(mv , value , name) ;
        }
    }

    if(Object.keys(attrs).length){

        structure.attrs = attrs ;
    }

    if(children.length === 0){

        let innerHTML = encode(el.innerHTML) ;

        if(innerHTML){

            structure.html = innerHTML ;

            if(placeholderTestRe.test(innerHTML)){

                vm.html = innerHTML ;

                mv_set(mv , innerHTML , 'html') ;
            }
        }

    }else{

        let cn = structure.cn = [] ;

        for(let childEl of children){

            cn.push(init(childEl)) ;
        }
    }

    return structure ;
}

const enterRe = /\r|\n/g,
      squotRe = /\'/g,
      dquotRe = /\"/g;

function encode(value){

    return value.replace(enterRe , '').replace(squotRe , '\\\'').replace(dquotRe , '\\"').trim() ;
}

function mv_set(target , name , value){

    if(!target.hasOwnProperty(name)){

        target[name] = [
            value
        ] ;

    }else{

        target[name].push(value) ;
    }
}

module.exports = init;