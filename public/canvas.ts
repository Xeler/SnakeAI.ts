import * as PIXI from 'pixi.js'

export class Canvas {
    public static width = 800;
    public static height = 600;
    
    private static _instance: Canvas;
    
    private _c : PIXI.Application;
    
    public constructor() {
        this.c = new PIXI.Application(Canvas.width, Canvas.height, {backgroundColor : 0x1099bb});
        Canvas._instance = this;
        document.body.appendChild(this._c.view);


        // Listen for animate update
        this._c.ticker.add(function(delta) {
            
            // just for fun, let's rotate mr rabbit a little
            // delta is 1 if running at 100% performance
            // creates frame-independent transformation
        //    bunny.rotation += 0.1 * delta;
        });

    }

    get c() {
        return this._c;
    }

    set c(c) {
        this._c = c;
    }

    public static getInstance() {
        if(Canvas._instance==null)
            return (Canvas._instance = new Canvas())
        return Canvas._instance;
    }
}