class EventMsg{

    constructor(txt,w,f){
        console.log("hello from event")
        this._text = txt;
        this._width = w;
        this._frame = f

    }

}

class CanvasTerminal{
    
    constructor(can){

        this._canvas = can;
        //this._canvas = canvas;
        this._ctx = this._canvas.getContext("2d");
        this._ctx.fillStyle = "rgba(0,0,0,.4)"
        this._ctx.fillText('Hello,hello', 100, 100);
        this._ctx.fillRect(20, 20, 150, 100);
        this._Events = []
        this._Events.push(new EventMsg("helle", 50, 50))
        console.log("Canvas Terminal");
        console.log( this._Events);
        
       
    }

    typeOut2(str,frame){
        
        console.log("typeOut2:", str);
        let width = this._ctx.measureText(str).width;

        e = new EventMsg("hello", 50,frame);
        console.log(this._Events)
        
        /// draw background rect assuming height of font
        this._ctx.fillStyle = "rgba(81,255,13,.5)" //"rgba(0,255,0,.4)"
        this._ctx.fillRect(x-10, y-60, width+20, 40);
        
        this._ctx.fillStyle = "rgba(0,0,0,.7)"
        this._ctx.fillText(str, x, y-30);
       
        //this._Events.push(new Event(str,width,frame));
        // for(let e in this._Events){

        //     console.log(e)
        // }

    }
}
