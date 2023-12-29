class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = []; // array of levels
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(
        new Level(
          neuronCounts[i], // input count
          neuronCounts[i + 1] // output count
        )
      );
    }
  }

  static feedForward(givenInputs, network) {
    let output = Level.feedForward(givenInputs, network.levels[0]); // feed forward the inputs
    for (let i = 1; i < network.levels.length; i++) {
      output = Level.feedForward(output, network.levels[i]); // feed forward the output of the previous level
    }
    return output; // return the output
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount); // array of inputs
    this.outputs = new Array(outputCount); // array of outputs
    this.biases = new Array(outputCount); // array of biases

    this.weights = []; // array of weights
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount); // create an array of weights
    }

    Level.#randomize(this); // randomize the weights and biases
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1; // randomize the weights
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1; // randomize the biases
    }
  }

  static feedForward(givenInputs, level) {
    // feed forward the inputs
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i]; // set the inputs
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0; // sum of the inputs
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i]; // add the weighted input to the sum
      }
      if (sum > level.biases[i]) {
        level.outputs[i] = 1; // set the output
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs; // return the output
  }
}
