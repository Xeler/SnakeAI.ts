import { Direction } from "./classes";
import { Snake } from "./snake"
import { Grid } from "./grid";
import { Canvas } from "./canvas";
import * as $ from "jquery";



let width = 800;
let height = 600;
let stepDelay = 5; //ms delay per step
let ts = 32 //tilesize






$(document).ready(()=>{
    Canvas.width = width;
    Canvas.height = height;
    let board = new Grid(width, height, ts);


    

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
        
        board.snake.move();

        

        setTimeout(()=>{step();}, stepDelay);
    }

    step();
});

