const EventEmitter = require('events') ;

function on(name , fn){

    let me = this,
    {
        emitter
    } = me;

    emitter.removeAllListeners(name) ;

    me.addEventListener(name , fn) ;
}

module.exports = class{
    
    constructor(url , protocols){

        let me = this,
            socket = me.socket = wx.connectSocket({
            url,
            protocols
        }),
        emitter = me.emitter = new EventEmitter() ;

        socket.onOpen(() => emitter.emit('open')) ;

        socket.onClose(() => emitter.emit('close')) ;

        socket.onMessage(event => emitter.emit('message' , event)) ;

        socket.onError(() => emitter.emit('error')) ;
    }

    get readyState(){

        return this.socket.readyState ;
    }

    addEventListener(name , fn){

        let {
            emitter
        } = this ;

        emitter.on(name , fn) ;
    }

    removeEventListener(name , fn){

        let {
            emitter
        } = this ;

        emitter.off(name , fn) ;
    }

    set onopen(fn){

        on.call(this , 'open' , fn) ;
    }

    set onclose(fn){

        on.call(this , 'close' , fn) ;
    }

    set onmessage(fn){

        on.call(this , 'message' , fn) ;
    }

    set onerror(fn){

        on.call(this , 'error' , fn) ;
    }

    send(data){

        this.socket.send({
            data
        }) ;
    }

    close(){

        this.socket.close() ;
    }
} ;