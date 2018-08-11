
import * as s from 'synaptic'

export class Net {
    
    public a: Synaptic.Architect.Perceptron;

    private trainer: Synaptic.Trainer;

    constructor() {
        this.a = new s.Architect.Perceptron(4, 5, 1);
        this.trainer = new s.Trainer(this.a);

    };

    activate(inputs: number[]) {
        return this.a.activate(inputs);
    }

    train(inputs:number[], outputs:number[]) {
        this.trainer.train([{input: inputs, output: outputs}]);
    }


}