class Bird {
  constructor(brain) {
    this.y = h/2;
    this.x = 50;

    this.lift = -12;
    this.gravity = 0.8;
    this.velocity = 0;

    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 8, 1);
    }
  }

  show() {
    fill(255, 100);
    ellipse(this.x, this.y, 32);
  }

  up() {
    this.velocity += this.lift;
  }

  mutate() {
    this.brain.mutate(0.1);
  }

  think(pipes) {
    let closest = null;
    let closestD = Infinity;
    for (let pipe of pipes) {
      let d = pipe.x - this.x;
      if (d < closestD && d > 0) {
        closest = pipe;
        closestD = d;
      }
    }

    let inputs = [];
    inputs[0] = this.y / h;
    inputs[1] = closest.top / h;
    inputs[2] = closest.bottom / h;
    inputs[3] = closest.x / width;
    inputs[4] = this.velocity / 10; // Ça change tout !
    let output = this.brain.predict(inputs);
    if (output[0] > 0.5) {
      this.up();
    }
  }

  update() {
    this.score++;

    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y > h) {
      this.y = h;
      this.velocity = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
}
