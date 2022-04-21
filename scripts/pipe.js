class Pipe {
  constructor() {
    this.spacing = 100;
    this.top = random(0, h - this.spacing);
    this.bottom = h - (this.top + this.spacing);
    this.x = width;
    this.w = 40;
    this.speed = 6;
  }

  show() {
    fill(255);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, h-this.bottom, this.w, this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  hits(bird) {
    return (bird.y < this.top || bird.y > h - this.bottom) && (bird.x > this.x && bird.x < this.x + this.w);
  }

}
