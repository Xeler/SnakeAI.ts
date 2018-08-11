import { Canvas } from "./canvas";
import * as PIXI from 'pixi.js'


export enum Direction {
    Up = "0,-1",
    Down = "0,1",
    Left = "-1,0",
    Right = "1,0",
}

export enum TileType {
    Wall = 0x000000,
    Head = 0x00ff00,
    Body = 0xffffff,
    Apple = 0xff0000,
    Empty = 0x0000ff
}


export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    

}


export class Tile {
    public type: TileType;
    private _position: Point
    public o: PIXI.Sprite
    
    public static ts: number = 16;


    constructor(type: TileType, pos: Point) {
        this.type=type;
        this.o = new PIXI.Sprite(PIXI.Texture.WHITE);
        Canvas.getInstance().c.stage.addChild(this.o);
        this.o.tint = this.type;

        this.position = pos;
        this.o.width = Tile.ts;
        this.o.height = Tile.ts;
        



    }

    get position() {
        return this._position;
    }

    set position(point: Point) {
        this.o.position.x = point.x*Tile.ts;
        this.o.position.y = point.y*Tile.ts;
        
        this._position = point;
    }


    
}





//Skud ud til stackoverflow
export function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};
