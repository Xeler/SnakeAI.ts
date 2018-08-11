import { Point, Tile, TileType, Direction } from "./classes";
import { Snake } from "./snake"
import { Grid } from "./grid";
import { Canvas } from "./canvas";
import * as $ from "jquery";
import { Net } from "./nn";



let width = 800;
let height = 600;
let stepDelay = 50; //per step
let ts = 32 //tilesize


let nn: Net;

const c = Canvas;

$(document).ready(()=>{
    let board = new Grid(width, height, ts);

    nn = new Net();


    

    $(document).keydown((e)=> {
        switch(e.which) {
            case 87:
                if(board.snake.action != Direction.Down)
                    board.snake.action = Direction.Up;
                    break;

            case 65:
                if(board.snake.action != Direction.Right)
                    board.snake.action = Direction.Left;
                    break;

            case 83:
                if(board.snake.action != Direction.Up)
                    board.snake.action = Direction.Down;
                    break;

            case 68:
                if(board.snake.action != Direction.Left)
                    board.snake.action = Direction.Right;
                    break;

            
        }
      });

    function step() {
        //draw surrounding grid:
        if(!board.snake.alive)
            board.snake = new Snake();

        let inputs = board.snake.getInputs(board.grid);
        
        let out = nn.activate(inputs);
        console.log(out);      
        if(out[0]<=0.5) {
            console.log("new move");
            board.snake.newAction(inputs, nn, board.grid);
            inputs = board.snake.getInputs(board.grid);
        }

        
        board.snake.move(board);
        nn.train(inputs, [+board.snake.alive]);
        
        


        setTimeout(()=>{step();}, stepDelay);
    }

    step();
});

