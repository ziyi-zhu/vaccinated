class Human {
  constructor(x, y, w, h, socialDistancing, distribution, isolation) {
    switch (distribution) {
      case "gaussian":
        this.x = floor(randomGaussian(0, w / 6)) + x;
        this.y = floor(randomGaussian(0, h / 6)) + y;
        break;
      case "random":
        this.x = floor(random(-w / 2, w / 2)) + x;
        this.y = floor(random(-h / 2, h / 2)) + y;
        break;
      case "grid":
        this.x = floor(random(-w / 15, w / 15)) + x + Math.round(random(-2, 2)) * w / 5;
        this.y = floor(random(-h / 15, h / 15)) + y + Math.round(random(-2, 2)) * h / 5;
        break;
    }
    this.w = w;
    this.h = h;
    this.diameter = 5;
    this.speed = Math.round(randomGaussian(0, 3.4 - socialDistancing));
    this.status = 0;
    this.isolation = isolation;
    this.timer = 0;
    this.virus = null;
  }

  intersects(other) {
    if (random(1) > this.virus.infectivity) {
      return 0;
    }
    let distance = dist(this.x, this.y, other.x, other.y);
    return distance < this.diameter + other.diameter;
  }

  move() {
    if ((this.status !== 2 || !this.isolation) && this.status !== 3) {
      this.x += random(-this.speed, this.speed);
      this.y += random(-this.speed, this.speed);

      this.x = Math.max(this.x, 0);
      this.x = Math.min(this.x, this.w);
      this.y = Math.max(this.y, 0);
      this.y = Math.min(this.y, this.h);
    }   
  }

  update() {
    if (this.status == 1) {
      this.timer++;
      if (this.timer > this.virus.incubationPeriod * 30) {
        this.status = 2;
        this.timer = 0;
      }
    } else if (this.status == 2) {
      this.timer++;
      if (this.timer > this.virus.recoveryPeriod * 30) {
        if (random(1) < this.virus.fatality) {
          this.status = 3;
        } else {
          this.status = 4;
        }    
        this.timer = 0;
      }
    }
  }

  show() {
    fill(colour[this.status]);
    noStroke();
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}

class Virus {
  constructor(infectivity, fatality, incubationPeriod, recoveryPeriod, immunity) {
    this.infectivity = infectivity;
    this.fatality = fatality;
    this.incubationPeriod = incubationPeriod;
    this.recoveryPeriod = recoveryPeriod;
    this.immunity = immunity;
  }
}

class Herd {
  constructor(population, socialDistancing, distribution, isolation, w, h) {
    this.x = w / 2;
    this.y = h / 2;
    this.w = w;
    this.h = h;
    this.population = population;
    this.socialDistancing = socialDistancing;
    this.distribution = distribution;
    this.isolation = isolation;
    this.array = [];

    for (let i = 0; i < this.population; i++) {
      this.array[i] = new Human(this.x, this.y, this.w, this.h, this.socialDistancing, this.distribution, this.isolation);
    }
  }

  display() {
    for (let human of this.array) {
      human.show();
    }
  }
}