
class NeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes, learningRate) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;
        this.learningRate = learningRate;

        // Инициализация весов
        this.weightsInputHidden = this.initializeWeights(this.inputNodes, this.hiddenNodes);
        this.weightsHiddenOutput = this.initializeWeights(this.hiddenNodes, this.outputNodes);

        // Инициализация смещений
        this.biasHidden = new Array(this.hiddenNodes).fill(1);
        this.biasOutput = new Array(this.outputNodes).fill(1);
    }

    initializeWeights(inputNodes, outputNodes) {
        return Array.from({ length: inputNodes }, () => Array.from({ length: outputNodes }, () => Math.random() * 2 - 1));
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    train(inputData, target) {
        // Прямое распространение
        let hiddenOutputs = [];
        for (let i = 0; i < this.hiddenNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputNodes; j++) {
                sum += inputData[j] * this.weightsInputHidden[j][i];
            }
            hiddenOutputs.push(this.sigmoid(sum));
        }
        
        let finalOutput = 0;
        for (let i = 0; i < this.outputNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenNodes; j++) {
                sum += hiddenOutputs[j] * this.weightsHiddenOutput[j][i];
            }
            finalOutput = this.sigmoid(sum);
        }

        const outputError = target - finalOutput;
        const outputDelta = outputError * finalOutput * (1 - finalOutput);

        let hiddenErrors = [];
        for (let i = 0; i < this.hiddenNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.outputNodes; j++) {
                sum += this.weightsHiddenOutput[i][j] * outputDelta;
            }
            hiddenErrors.push(sum);
        }

        let hiddenDeltas = [];
        for (let i = 0; i < this.hiddenNodes; i++) {
            hiddenDeltas.push(hiddenErrors[i] * hiddenOutputs[i] * (1 - hiddenOutputs[i]));
        }

        // Обновление весов
        for (let i = 0; i < this.outputNodes; i++) {
            for (let j = 0; j < this.hiddenNodes; j++) {
                this.weightsHiddenOutput[j][i] += this.learningRate * outputDelta * hiddenOutputs[j];
            }
        }

        for (let i = 0; i < this.hiddenNodes; i++) {
            for (let j = 0; j < this.inputNodes; j++) {
                this.weightsInputHidden[j][i] += this.learningRate * hiddenDeltas[i] * inputData[j];
            }
        }
    }

    predict(inputData) {
        let hiddenOutputs = [];
        for (let i = 0; i < this.hiddenNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputNodes; j++) {
                sum += inputData[j] * this.weightsInputHidden[j][i];
            }
            hiddenOutputs.push(this.sigmoid(sum));
        }
        
        let finalOutput = 0;
        for (let i = 0; i < this.outputNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenNodes; j++) {
                sum += hiddenOutputs[j] * this.weightsHiddenOutput[j][i];
            }
            finalOutput = this.sigmoid(sum);
        }

        return finalOutput;
    }
}

const network = new NeuralNetwork(25, 50, 1, 0.1);
const trainingData = [
    //широкие
    { input: [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1], target: 0 },
    { input: [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1], target: 0.1 },
    { input: [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1], target: 0.2 },
    { input: [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], target: 0.3 },
    { input: [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], target: 0.4 },
    { input: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], target: 0.5 },
    { input: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1], target: 0.6 },
    { input: [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], target: 0.7 },
    { input: [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1], target: 0.8 },
    { input: [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], target: 0.9 },
    //интересные цифры
    { input: [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0], target: 0 },
    { input: [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0], target: 0.2 },
    { input: [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0], target: 0.3 },
    { input: [1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0], target: 0.3 },// сдвиг 3 влево
    { input: [0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0], target: 0.5 },
    { input: [0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0], target: 0.6 },
    { input: [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0], target: 0.8 },
    { input: [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0], target: 0.9 },
    //обычные в центре
    { input: [0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0], target: 0 },
    { input: [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0], target: 0.1 },
    { input: [0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0], target: 0.2 },
    { input: [0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0], target: 0.3 },
    { input: [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], target: 0.4 },
    { input: [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0], target: 0.5 },
    { input: [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0], target: 0.6 },
    { input: [0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], target: 0.7 },
    { input: [0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0], target: 0.8 },
    { input: [0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0], target: 0.9 },
    //обычные слева
    { input: [1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0], target: 0 },
    { input: [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0], target: 0.1 },
    { input: [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0], target: 0.2 },
    { input: [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0], target: 0.3 },
    { input: [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0], target: 0.4 },
    { input: [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0], target: 0.5 },
    { input: [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0], target: 0.6 },
    { input: [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0], target: 0.7 },
    { input: [1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0], target: 0.8 },
    { input: [1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0], target: 0.9 },
    //обычные справа
    { input: [0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1], target: 0 },
    { input: [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1], target: 0.1 },
    { input: [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1], target: 0.2 },
    { input: [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], target: 0.3 },
    { input: [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], target: 0.4 },
    { input: [0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], target: 0.5 },
    { input: [0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1], target: 0.6 },
    { input: [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], target: 0.7 },
    { input: [0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1], target: 0.8 },
    { input: [0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1], target: 0.9 },
    //чуть более широкие слева
    { input: [1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0], target: 0 },
    { input: [1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0], target: 0.2 },
    { input: [1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0], target: 0.3 },
    { input: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], target: 0.4 },
    { input: [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0], target: 0.5 },
    { input: [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0], target: 0.6 },
    { input: [1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], target: 0.7 },
    { input: [1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0], target: 0.8 },
    { input: [1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0], target: 0.9 },
    //чуть более широкие справа
    { input: [0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1], target: 0 },
    { input: [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1], target: 0.2 },
    { input: [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1], target: 0.3 },
    { input: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], target: 0.4 },
    { input: [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1], target: 0.5 },
    { input: [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1], target: 0.6 },
    { input: [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], target: 0.7 },
    { input: [0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1], target: 0.8 },
    { input: [0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1], target: 0.9 },
];

for (let i = 0; i < 2500; i++) {
    trainingData.forEach(data => {
        network.train(data.input, data.target);
    });
}

function between(x, min, max) 
{
    return x >= min && x <= max;

}

function start(inputData)
{
    const prediction = network.predict(inputData);
    if(between(prediction, 0, 0.0449)){
        window.alert("Найденная цифра: 0")
    }
    else if(between(prediction, 0.045, 0.1449)){
        window.alert("Найденная цифра: 1")
    }
    else if(between(prediction, 0.145, 0.2449)){
        window.alert("Найденная цифра: 2")
    }
    else if(between(prediction, 0.245, 0.3449)){
        window.alert("Найденная цифра: 3")
    }
    else if(between(prediction, 0.345, 0.4449)){
        window.alert("Найденная цифра: 4")
    }
    else if(between(prediction, 0.445, 0.5449)){
        window.alert("Найденная цифра: 5")
    }
    else if(between(prediction, 0.545, 0.6449)){
        window.alert("Найденная цифра: 6")
    }
    else if(between(prediction, 0.645, 0.7449)){
        window.alert("Найденная цифра: 7")
    }
    else if(between(prediction, 0.745, 0.8449)){
        window.alert("Найденная цифра: 8")
    }
    else if(between(prediction, 0.845, 1)){
        window.alert("Найденная цифра: 9")
    }
    console.log(prediction);
}