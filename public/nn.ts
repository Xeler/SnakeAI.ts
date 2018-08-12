
import * as s from 'synaptic'

export class Net {
    
    private static _instance : Net;

    private a: Synaptic.Architect.Perceptron;

    private trainer: Synaptic.Trainer;

    private constructor() {
        this.a = new s.Architect.Perceptron(5, 5, 1);
        this.trainer = new s.Trainer(this.a);

    };

    public static getInstance() {
        if(Net._instance==null) {
            Net._instance = new Net();
        }
        return Net._instance;

    }

    activate(inputs: number[]) {
        return this.a.activate(inputs);
    }

    train(inputs:number[], outputs:number[]) {
        this.trainer.train([{input: inputs, output: outputs}]);
    }


}


export class Output {
    public output;
    constructor(output:number[] = [0,0]) {
        if(output.length<2)
            output.fill(1, output.length, 2)
        this.output = output;
    }



    get survived() {
        return this.output[0]
    }
    set survived(x) {
        this.output[0] = +x
    }
}



export class Input {
    private input;
    
    constructor(input:number[] = new Array(5).fill(0)) {
        this.input = input;
    }

    getArray() {
        this.input.length = 5;
        return this.input;
    }

    

    get obstacleOnLeft() {
        return this.input[0];
    }
    set obstacleOnLeft(x) {
        this.input[0] = +x;
    }

    get obstacleOnForward() {
        return this.input[1];
    }
    set obstacleOnForward(x) {
        this.input[1] = +x;
    }

    get obstacleOnRight() {
        return this.input[2];
    }
    set obstacleOnRight(x) {
        this.input[2] = +x;
    }

    get moveLeft() {
        return this.input[3];
    }
    set moveLeft(x) {
        this.input[3] = +x;
    }

    get moveRight() {
        return this.input[4];
    }
    set moveRight(x) {
        this.input[4] = +x;
    }

    get radiansToApple() {
        
        return this.input[5];
    }
    set radiansToApple(x) {
        this.input[5] = +x;
    }



}