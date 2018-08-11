import { Snake } from "./snake";
import { Point, Tile, TileType } from "./classes";
import { Canvas } from "./canvas";



export class Grid {
    //Position for hovedet

    snake: Snake;
    grid: Tile[];

    width: number;
    height: number;
    ts: number;
    max: Point;

    constructor(w: number, h: number, ts: number) {
        this.width = w;
        this.height = h;
        this.ts = ts;
        Tile.ts = ts;

        this.max = new Point(0,0);
        this.max.x = Math.floor(this.width/this.ts)-1;
        this.max.y = Math.floor(this.height/this.ts)-1;

        this.snake = new Snake(new Point(5,8), 3);
        this.snake.spawnNewApple(this.max);

        
        this.grid = new Array();
        for(let x=0;x<=Math.floor(w/ts); x++) {
            for(let y=0;y<Math.floor(h/ts); y++) {
                if(y == 0 || x==0 || y==Math.floor(h/ts)-1 || x==Math.floor(w/ts)-1) {
                    this.grid.push(new Tile(TileType.Wall, new Point(x,y)));
                    console.log("g on " + x + ", " + y);
                }
                    
            }
        }
    }


    /*
    public spawnNewApple() {
        
        if(this.apple!=null) Canvas.getInstance().c.stage.removeChild(this.apple.o);
        let x = Math.floor(Math.random() * (Math.floor(this.width/this.ts)-2)) + 1;
        let y = Math.floor(Math.random() * (Math.floor(this.height/this.ts)-2)) + 1;
        let p = new Point(x,y);
        console.log(this.width + ", " + this.ts);
        let e: Tile;
        for(e of this.snake.body) {
            if(e.position.x==p.x && e.position.y==p.y)
                return this.spawnNewApple();
        }
        this.apple = new Tile(TileType.Apple, new Point(x,y))
        console.log("ny on " + x + ", " +y);
        return true;
        
    }

    */


}