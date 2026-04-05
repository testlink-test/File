const canvas = document.getElementById("birthday");
const ctx = canvas.getContext("2d");

const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = _ => new Date().getTime();

class Firework {
  constructor(sx, sy, tx, ty, hue, offsprings) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.hue = hue;
    this.offsprings = offsprings;
    this.dead = false;

    this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
    this.distanceTraveled = 0;

    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) this.coordinates.push([this.x, this.y]);

    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.acceleration;

    let vx = Math.cos(this.angle) * this.speed;
    let vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = Math.hypot(this.x + vx - this.sx, this.y + vy - this.sy);

    if (this.distanceTraveled >= this.distanceToTarget) {
      for (let i = 0; i < this.offsprings; i++) {
        birthday.fireworks.push(new Particle(this.tx, this.ty, this.hue));
      }
      this.dead = true;
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(...this.coordinates[this.coordinates.length - 1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${this.hue},100%,${this.brightness}%)`;
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) this.coordinates.push([this.x, this.y]);

    this.angle = random(0, PI2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = hue;
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) this.dead = true;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(...this.coordinates[this.coordinates.length - 1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue},100%,${this.brightness}%,${this.alpha})`;
    ctx.stroke();
  }
}

class Birthday {
  constructor() {
    this.resize();
    this.fireworks = [];
    this.counter = 0;

    window.addEventListener("resize", () => this.resize());
    canvas.addEventListener("click", e => this.onClick(e));
    canvas.addEventListener("touchstart", e => this.onClick(e));

    this.loop();
  }

  resize() {
    this.width = canvas.width = window.innerWidth;
    let center = this.width / 2 | 0;
    this.spawnA = center - center / 4 | 0;
    this.spawnB = center + center / 4 | 0;

    this.height = canvas.height = window.innerHeight;
    this.spawnC = this.height * .1;
    this.spawnD = this.height * .5;
  }

  onClick(evt) {
    let x = evt.clientX || evt.touches[0].pageX;
    let y = evt.clientY || evt.touches[0].pageY;

    let count = random(3, 5);
    for (let i = 0; i < count; i++) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        x,
        y,
        random(0, 360),
        random(30, 110)
      ));
    }
  }

  update() {
    let i = this.fireworks.length;
    while (i--) {
      this.fireworks[i].update(i);
      if (this.fireworks[i].dead) this.fireworks.splice(i, 1);
    }

    if (this.counter++ >= 30) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0, this.width),
        random(this.spawnC, this.spawnD),
        random(0, 360),
        random(30, 110)
      ));
      this.counter = 0;
    }
  }

  draw() {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalCompositeOperation = "lighter";

    this.fireworks.forEach(f => {
      f.draw();
    });
  }

  loop() {
    requestAnimationFrame(() => this.loop());
    this.update();
    this.draw();
  }
}

const birthday = new Birthday();
