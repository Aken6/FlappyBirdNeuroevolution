const TOTAL = 300;
const w = 640; // width of the game
const h = 480; // Height of the game

let canvas;
let slider;

let birds = [];
let savedBirds = [];
let pipes = [];

let counter = 0;
let generation = 1;
let max_score = 0;
let score = 0;

let text_generation;
let text_best_score;
let text_score;

function setup() {
  canvas = createCanvas(w, windowHeight);
  canvas.parent('sketch-holder');
  centerCanvas();
  text_generation = document.getElementById('generation');
  text_best_score = document.getElementById('best-score');
  text_score = document.getElementById('score');
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
  slider = createSlider(1, 100, 1);
  slider.parent('sketch-holder');
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 75 === 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      for (let j = birds.length-1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }
      if (pipes[i].x < -pipes[i].w) {
        pipes.splice(i, 1);
        updateScores();
      }
    }
    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }
    if (birds.length === 0) {
      counter = 0;
      generation++;
      score = 0;
      text_score.innerHTML = 'Score : ' + score.toString();
      text_generation.innerHTML = 'Génération : ' + generation.toString();
      nextGeneration();
      pipes = [];
    }
  }

  // All the drawing stuff
  background(0);
  strokeWeight(1);
  for (let bird of birds) {
    bird.show();
  }
  for (let pipe of pipes) {
    pipe.show();
  }
  drawNN(birds[0].brain);
}

function updateScores() {
  score++;
  text_score.innerHTML = 'Score : ' + score.toString();
  if (score > max_score) {
    max_score = score;
    text_best_score.innerHTML = 'Meilleur score : ' + max_score.toString();
  }
}

function drawNN(nn) {
  let size_max = 32;
  let n_i = nn.input_nodes;
  let n_h = nn.hidden_nodes;
  let n_o = nn.output_nodes;
  let size_input = [];

  for (let i = 0; i < n_i; i++) {
    size_input[i] = 0;
    for (let j = 0; j < nn.weights_ih.rows-1; j++) {
      size_input[i] += abs(nn.weights_ih.data[j][i]);
    }
  }
  for (let i = 0; i < n_i; i++) {
    size_input[i] = map(size_input[i], 0, max(size_input), 2, size_max);
  }

  fill(255);
  rect(0, h, w, windowHeight);
  for (let i = 0; i < n_i; i++) {
    fill(0);
    ellipse(width/6, h + (windowHeight - h)/(2*n_i)*(1 + 2*i), size_input[i]);
    for (let j = 0; j < n_h; j++) {
      strokeWeight(nn.weights_ih.data[j][i]*3);
      line(width/6, h + (windowHeight - h)/(2*n_i)*(1 + 2*i), width/2, h + (windowHeight - h)/(2*n_h)*(1 + 2*j));
    }
  }
  for (let i = 0; i < n_h; i++) {
    ellipse(width/2, h + (windowHeight - h)/(2*n_h)*(1 + 2*i), size_max);
    for (let j = 0; j < n_o; j++) {
      strokeWeight(nn.weights_ho.data[j][i]*3);
      line(width/2, h + (windowHeight - h)/(2*n_h)*(1 + 2*i), 5*width/6, h + (windowHeight - h)/(2*n_o)*(1 + 2*j));
    }
  }
  for (let i = 0; i < n_o; i++) {
    ellipse(5*width/6, h + (windowHeight - h)/(2*n_o)*(1 + 2*i), size_max);
  }
}


function windowResized() {
  centerCanvas();
}

function centerCanvas() {
  canvas.position((windowWidth - width)/2, 0);
}
