import { Point, Direction, TileType, Tile, array_move } from "./classes";
import { Canvas } from "./canvas";
import { Grid } from "./grid"
import { Net, Input, Output } from "./nn";

export class Snake {
    //Position for hovedet
    public position: Point;
    public action: Direction;
    public lastAction: Direction;
    public alive : Boolean;

    public apple: Tile
    public body: Tile[];

    private input : Input;

    constructor(start: Point = new Point(5,8), length = 3 ) {
        this.position = start;
        this.action = Direction.Right;
        this.lastAction = Direction.Right;
        this.alive = true;
        this.body = new Array();
        this.input = new Input();

        //Spawn headasd:
        this.body.push(new Tile(TileType.Head, start));
        //body:
        for(let i=1;i<=length;i++) {
            this.body.push(new Tile(TileType.Body, new Point(start.x-i, start.y)));
        }
        
        this.spawnNewApple();

    }

    die() {
        Canvas.getInstance().c.stage.removeChild(this.apple.o);

        for(let e of this.body) {
            Canvas.getInstance().c.stage.removeChild(e.o);
        }

        this.alive = false;
    }

    smellApple() {
        let vs = Math.atan2(this.body[0].position.y, this.body[0].position.x);
        let va = Math.atan2(this.apple.position.y, this.apple.position.x)

        this.input.radiansToApple = vs-va;
//        console.log(vs-va);

		return ;


    }

    move() {
        //indlæs 
        this.senseObstacles();
        this.smellApple();
        this.input.moveLeft = false;
        this.input.moveRight = false;


        let out = new Output(Net.getInstance().activate(this.input.getArray()));

        if(out.survived<=0.5) {
            
            this.newAction();
            
        }

        let x:number = parseInt(this.action.split(",")[0]);
        let y:number = parseInt(this.action.split(",")[1]);

        //"Halen" på slangen flyttes i vores array
        array_move(this.body, this.body.length-1, 1)
        this.body[1].position = this.body[0].position;

        //opdater x og y position for hovedet
        this.body[0].position = new Point(this.body[0].position.x+x, this.body[0].position.y+y);
        

        //tjek hvad vi kolliderer med
        this.checkCollision();


        //træn netværket
        if(!this.alive)
            console.log(this.input.getArray());
            
        Net.getInstance().train(this.input.getArray(), [+this.alive]);

    }

    checkCollision() : void {
        if(this.body[0].position.x==this.apple.position.x && this.body[0].position.y==this.apple.position.y) {
            this.grow();
            this.spawnNewApple();
        }
        for(let e of this.body) {

            if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y==e.position.y) {
                this.die();
            }
        }
        
        for(let e of Grid.grid) {
            if(this.body[0].position.x==e.position.x && this.body[0].position.y==e.position.y) {
                this.die();
            }
        }

    }



    grow() : void {
        let newTile = new Tile(TileType.Body, this.body[this.body.length-1].position);
        this.body.push(newTile);
    }

    spawnNewApple() : void {
        let max = Grid.max;
        if(this.apple!=null) Canvas.getInstance().c.stage.removeChild(this.apple.o);
        let x = Math.floor(Math.random() * (max.x-1)) + 1;
        let y = Math.floor(Math.random() * (max.y-1)) + 1;
        let p = new Point(x,y);
        let e: Tile;
        for(e of this.body) {
            if(e.position.x==p.x && e.position.y==p.y)
                return this.spawnNewApple();
        }
        this.apple = new Tile(TileType.Apple, new Point(x,y))        
    }

    changeDirection(target : Direction) : void {
        
        switch(this.action) {
            case Direction.Up:
                if(target==Direction.Left)
                    this.action = Direction.Left;
                else
                    this.action = Direction.Right
                break;
            
            case Direction.Left:
                if(target==Direction.Left)
                    this.action = Direction.Down;
                else
                    this.action = Direction.Up;
                break;
            
            case Direction.Down:
                if(target==Direction.Left)
                    this.action = Direction.Right;
                else
                    this.action = Direction.Left;
                break;
            

            case Direction.Right:
                if(target==Direction.Left)
                    this.action = Direction.Up;
                else
                    this.action = Direction.Down;
                break;

        }
    }

    newAction() {
        this.input.moveLeft = true;
        let oL = Net.getInstance().activate(this.input.getArray())[0];
        this.input.moveRight = true;
        this.input.moveLeft = false;
        let oR = Net.getInstance().activate(this.input.getArray())[0];
        if(oL>oR)
            this.changeDirection(Direction.Left);
        else
            this.changeDirection(Direction.Right);
        this.input.moveLeft = (oL>oR);
        this.input.moveRight = !(oL>oR);
        console.log((oL>oR));
        console.log(this.input.moveRight);
        
    }


    senseObstacles() : Input{
        this.input.obstacleOnLeft = false;
        this.input.obstacleOnForward = false;
        this.input.obstacleOnRight = false;
        //Get nn inputs:
        switch(this.action) {
            case Direction.Up:
                for(let e of this.body) {
                    if(e.type!=TileType.Head && this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                        this.input.obstacleOnLeft = true;
                    }

                    if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                        this.input.obstacleOnForward = true;
                    }
                    if(e.type!=TileType.Head && this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                        this.input.obstacleOnRight = true;
                    }
                }
        
                for(let e of Grid.grid) {
                    if(this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                        this.input.obstacleOnLeft = true;
                    }

                    if(this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                        this.input.obstacleOnForward = true;
                    }
                    if(this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                        this.input.obstacleOnRight = true;
                    }
                }
                break;

            case Direction.Left:
                for(let e of this.body) {
                    if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                        this.input.obstacleOnLeft = true;
                    }

                    if(e.type!=TileType.Head && this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                        this.input.obstacleOnForward = true;
                    }
                    if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                        this.input.obstacleOnRight = true;
                    }
                }
        
                for(let e of Grid.grid) {
                    if(this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                        this.input.obstacleOnLeft = true;
                    }

                    if(this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                        this.input.obstacleOnForward = true;
                    }
                    if(this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                        this.input.obstacleOnRight = true;
                    }
                }
                break;

            case Direction.Down:
            for(let e of this.body) {
                if(e.type!=TileType.Head && this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                    this.input.obstacleOnLeft = true;
                }

                if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                    this.input.obstacleOnForward = true;
                }
                if(e.type!=TileType.Head && this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                    this.input.obstacleOnRight = true;
                }
            }
    
            for(let e of Grid.grid) {
                if(this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                    this.input.obstacleOnLeft = true;
                }

                if(this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                    this.input.obstacleOnForward = true;
                }
                if(this.body[0].position.x-1== e.position.x && this.body[0].position.y==e.position.y) {
                    this.input.obstacleOnRight = true;

                }
            }
                break;

            case Direction.Right:
                for(let e of this.body) {
                    if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                        this.input.obstacleOnLeft = true;
                    }

                    if(e.type!=TileType.Head && this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                        this.input.obstacleOnForward = true;
                        //snake on forward
                    }
                    if(e.type!=TileType.Head && this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                        this.input.obstacleOnRight = true;
                        //snake on right
                    }
                }
        
                for(let e of Grid.grid) {
                    if(this.body[0].position.x== e.position.x && this.body[0].position.y-1==e.position.y) {
                        this.input.obstacleOnLeft = true;
                    }

                    if(this.body[0].position.x+1== e.position.x && this.body[0].position.y==e.position.y) {
                        this.input.obstacleOnForward = true;
                    }
                    if(this.body[0].position.x== e.position.x && this.body[0].position.y+1==e.position.y) {
                        this.input.obstacleOnRight = true;
                        //snake on right
                    }
                }
                break;

            
        }
                
        return this.input;
    }
}



