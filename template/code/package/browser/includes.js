{
    function includes(target){

        return this.indexOf(target) !== -1 ;
    }

    function init(target){

        target.prototype.includes = target.prototype.includes || includes ;
    }

    init(Array) ;

    init(String) ;
}