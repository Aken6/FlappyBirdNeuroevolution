let nn;
let n_i = 10;
let n_h = 10;
let n_o = 10;
let inputs = [0, 1, 0, 0, 0, 0, 1, 1, 1, 0];
let targets = [0, 1, 0, 0, 0, 0, 1, 1, 1, 0];
let output;

function setup() {
  createCanvas(720, 480);
  background(255);
  //noLoop();

  nn = new NeuralNetwork(n_i, n_h, n_o);
}

function draw() {
  background(255);
  output = nn.predict(inputs);
  nn.train(inputs, targets);

  drawNN();
}

function drawNN() {
  textSize(24);
  // Calcul de la somme des poids associes aux noeuds d'entree
  let size_input = [];
  for (let i = 0; i < n_i; i++) {
    size_input[i] = 0;
    for (let j = 0; j < nn.weights_ih.rows-1; j++) {
      size_input[i] += abs(nn.weights_ih.data[j][i]);
    }
  }
  for (let i = 0; i < n_i; i++) {
    size_input[i] = map(size_input[i], 0, max(size_input), 2, 32);
  }
  for (let i = 0; i < n_i; i++) {
    fill(0);
    ellipse(width/6, height/(2*n_i)*(1 + 2*i), size_input[i]);
    fill(150);
    textAlign(RIGHT, CENTER);
    text(inputs[i].toString().slice(0, 5), width/6 - 25, height/(2*n_i)*(1 + 2*i))
    fill(0);
    for (let j = 0; j < n_h; j++) {
      strokeWeight(nn.weights_ih.data[j][i]*3);
      line(width/6, height/(2*n_i)*(1 + 2*i), width/2, height/(2*n_h)*(1 + 2*j));
    }
  }
  for (let i = 0; i < n_h; i++) {
    ellipse(width/2, height/(2*n_h)*(1 + 2*i), 32);
    for (let j = 0; j < n_o; j++) {
      strokeWeight(nn.weights_ho.data[j][i]*3);
      line(width/2, height/(2*n_h)*(1 + 2*i), 5*width/6, height/(2*n_o)*(1 + 2*j));
    }
  }
  for (let i = 0; i < n_o; i++) {
    ellipse(5*width/6, height/(2*n_o)*(1 + 2*i), 32);
    fill(150);
    textAlign(LEFT, CENTER);
    text(output[i].toString().slice(0, 5), 5*width/6 + 25, height/(2*n_o)*(1 + 2*i))
    fill(0);
  }
}
