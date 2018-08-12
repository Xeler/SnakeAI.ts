import { Snake } from "./snake";
import { Point, Tile, TileType } from "./classes";



export class Grid {
    //Position for hovedet

    snake: Snake;
    public static grid: Tile[] = new Array();

    public static width: number;
    public static height: number;
    ts: number;
    public static max: Point;

    constructor(w: number, h: number, ts: number) {
        Grid.width = w;
        Grid.height = h;

        Tile.ts = ts;

        Grid.max = new Point(0,0);
        Grid.max.x = Math.floor(Grid.width/ts)-1;
        Grid.max.y = Math.floor(Grid.height/ts)-1;

        this.snake = new Snake(new Point(5,8), 3);
        this.snake.spawnNewApple(Grid.max);

        
        for(let x=0;x<=Math.floor(w/ts); x++) {
            for(let y=0;y<Math.floor(h/ts); y++) {
                if(y == 0 || x==0 || y==Math.floor(h/ts)-1 || x==Math.floor(w/ts)-1) {
                    Grid.grid.push(new Tile(TileType.Wall, new Point(x,y)));
                }
                    
            }
        }
    }


}