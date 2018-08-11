import { Point, Direction, TileType, Tile, array_move } from "./classes";
import { Canvas } from "./canvas";
import { Grid } from "./grid"
import { Net } from "./nn";




export class Snake {
    //Position for hovedet
    public position: Point;
    public action: Direction;
    public lastAction: Direction;
    public alive : Boolean;

    private brain: Brain;
    public apple: Tile
    private size: number;
    public body: Tile[];

    private _inputs : number[];

    constructor(start: Point = new Point(5,8), length = 3 ) {
        this.position = start;
        this.action = Direction.Right;
        this.lastAction = Direction.Right;
        this.alive = true;
        this.body = new Array();

        //Spawn headasd:
        this.body.push(new Tile(TileType.Head, start));
        //body:
        for(let i=1;i<=length;i++) {
            this.body.push(new Tile(TileType.Body, new Point(start.x-i, start.y)));
        }
        

    }

    die() {
        Canvas.getInstance().c.stage.removeChild(this.apple.o);

        for(let e of this.body) {
            Canvas.getInstance().c.stage.removeChild(e.o);
        }

        this.alive = false;
    }

    move(grid: Grid) {
        let x:number = parseInt(this.action.split(",")[0]);
        let y:number = parseInt(this.action.split(",")[1]);
        
        
        //"Halen" på slangen flyttes i vores array
        array_move(this.body, this.body.length-1, 1)
        this.body[1].position = this.body[0].position;
        //opdater x og y position for hovedet
        this.body[0].position = new Point(this.body[0].position.x+x, this.body[0].position.y+y);
        
        
        if(!this.apple)
            this.spawnNewApple(grid.max);

        if(this.body[0].position.x==this.apple.position.x && this.body[0].position.y==this.apple.position.y) {
            this.grow();
            this.spawnNewApple(grid.max);
        }
        for(let e of this.body) {

            if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y==e.position.y) {
                this.die();
            }
        }
        
        for(let e of grid.grid) {
            if(this.body[0].position.x==e.position.x && this.body[0].position.y==e.position.y) {
                console.log("ded on wal");
                this.die();
            }
        }
        





        return this.body[0].position;
    }

    grow() {
        let newTile = new Tile(TileType.Body, this.body[this.body.length-1].position);
        this.body.push(newTile);
        this.size++;

    }

    spawnNewApple(max: Point) {
        
        if(this.apple!=null) Canvas.getInstance().c.stage.removeChild(this.apple.o);
        let x = Math.floor(Math.random() * (max.x-1)) + 1;
        let y = Math.floor(Math.random() * (max.y-1)) + 1;
        let p = new Point(x,y);
        let e: Tile;
        for(e of this.body) {
            if(e.position.x==p.x && e.position.y==p.y)
                return this.spawnNewApple(max);
        }
        this.apple = new Tile(TileType.Apple, new Point(x,y))
        return true;
        
    }

    newAction(oldInput: number[], nn: Net, grid: Tile[]) {
        let possibleActions = new Array();
        oldInput[3] = 1;
        let oL = nn.activate(oldInput)[0];
        oldInput[3] = 0;
        oldInput[4] = 1;
        let oR = nn.activate(oldInput)[0];
        switch(this.action) {

            case Direction.Up:
                if(oL>oR)
                this.action = Direction.Left;
                else
                    this.action = Direction.Right
                break;
            
            case Direction.Left:
                if(oL>oR)
                    this.action = Direction.Down;
                else
                    this.action = Direction.Up;
                break;
            
            case Direction.Down:
                if(oL>oR)
                    this.action = Direction.Right;
                else
                    this.action = Direction.Left;
                break;
            

            case Direction.Right:
                if(oL>oR)
                    this.action = Direction.Up;
                else
                    this.action = Direction.Down;
                break;

        }
            
    }


    getInputs(grid: Tile[]) : number[]{
                //dø på left? forward? right? går til venstre? går til højre?
                this._inputs = [0,0,0,0,0];
                //Get nn inputs:
                if(this.action!=this.lastAction) {
                    switch(this.lastAction) {
                        case Direction.Up:
                            if(this.action == Direction.Left)
                                this._inputs[3] = 1;
                            
                            else if(this.action==Direction.Right)
                                this._inputs[4] = 1;
                            break;
        
        
                        case Direction.Left:
                            if(this.action == Direction.Down)
                                this._inputs[3] = 1;
                            
                            else if(this.action==Direction.Up)
                                this._inputs[4] = 1;
                            break;
        
                        case Direction.Down:
                            if(this.action == Direction.Right)
                                this._inputs[3] = 1;
                            
                            else if(this.action==Direction.Left)
                                this._inputs[4] = 1;
                            break;
                        case Direction.Right:
                            if(this.action == Direction.Up)
                                this._inputs[3] = 1;
                        
                            else if(this.action==Direction.Down)
                                this._inputs[4] = 1;
                            break;
                    }
                }
        
        
                switch(this.action) {
                    case Direction.Up:
                        for(let e of this.body) {
                            if(e.type!=TileType.Head && this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                                this._inputs[0] = 1;
                            }
        
                            if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                                this._inputs[1] = 1;
                                //snake on right
                            }
                            if(e.type!=TileType.Head && this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                                this._inputs[2] = 1;
                                //snake on right
                            }
                        }
                
                        for(let e of grid) {
                            if(this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                                this._inputs[0] = 1;
                            }
        
                            if(this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                                this._inputs[1] = 1;
                                //snake on right
                            }
                            if(this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                                this._inputs[2] = 1;
                                //snake on right
                            }
                        }
                        break;
        
                    case Direction.Left:
                        for(let e of this.body) {
                            if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                                this._inputs[0] = 1;
                            }
        
                            if(e.type!=TileType.Head && this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                                this._inputs[1] = 1;
                                //snake on forward
                            }
                            if(e.type!=TileType.Head && this.body[0].position.x+1== e.position.x && this.body[0].position.y-1==e.position.y) {
                                this._inputs[2] = 1;
                                //snake on right
                            }
                        }
                
                        for(let e of grid) {
                            if(this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                                this._inputs[0] = 1;
                            }
        
                            if(this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                                this._inputs[1] = 1;
                                //tile on forward
                            }
                            if(this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                                this._inputs[2] = 1;
                                //snake on right
                            }
                        }
                        break;
        
                    case Direction.Down:
                    for(let e of this.body) {
                        if(e.type!=TileType.Head && this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                            this._inputs[0] = 1;
                        }
        
                        if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                            this._inputs[1] = 1;
                            //snake on forward
                        }
                        if(e.type!=TileType.Head && this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                            this._inputs[2] = 1;
                            //snake on right
                        }
                    }
            
                    for(let e of grid) {
                        if(this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                            this._inputs[0] = 1;
                        }
        
                        if(this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                            this._inputs[1] = 1;
                            //tile on forward
                        }
                        if(this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                            this._inputs[2] = 1;
                            //snake on right
                        }
                    }
                        break;
        
                    case Direction.Right:
                        for(let e of this.body) {
                            if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                                this._inputs[0] = 1;
                            }
        
                            if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y==e.position.y) {
                                this._inputs[1] = 1;
                                //snake on forward
                            }
                            if(e.type!=TileType.Head && this.body[0].position.x+1== e.position.x && this.body[0].position.y+1==e.position.y) {
                                this._inputs[2] = 1;
                                //snake on right
                            }
                        }
                
                        for(let e of grid) {
                                if(this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                                this._inputs[0] = 1;
                            }
        
                            if(this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                                this._inputs[1] = 1;
                                //tile on forward
                            }
                            if(this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                                this._inputs[2] = 1;
                                //snake on right
                            }
                        }
                        break;
        
                    
                }
                
        return this._inputs;
    }
}



export class Brain {
    
    public moves : Direction[];

    constructor() {
        this.moves = new Array();

    }

    



}