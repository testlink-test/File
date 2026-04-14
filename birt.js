const canvas = document.getElementById("birthday");
const ctx = canvas.getContext("2d");

const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min) + min;

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
    for (let i = 0; i < 3; i++) this.coordinates.push([this.x, this.y]);

    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 3;
    this.acceleration = 1.08;
    this.brightness = random(50, 70);
  }

  update() {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.acceleration;

    let vx = Math.cos(this.angle) * this.speed;
    let vy = Math.sin(this.angle) * this.speed;

    this.distanceTraveled = Math.hypot(
      this.x + vx - this.sx,
      this.y + vy - this.sy
    );

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
    for (let i = 0; i < 5; i++) this.coordinates.push([this.x, this.y]);

    this.angle = random(0, PI2);
    this.speed = random(2, 8);
    this.friction = 0.95;
    this.gravity = 0.8;

    this.hue = hue;
    this.brightness = random(50, 80);

    this.alpha = 1;
    this.decay = random(0.015, 0.03);
  }

  update() {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.friction;

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;

    this.alpha -= this.decay;

    if (this.alpha <= 0) this.dead = true;
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

    window.addEventListener("resize", () => this.resize());

    this.loop();
  }

  resize() {
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
  }

  update() {
    // 🔥 Auto fireworks
    if (Math.random() < 0.11) {
      let x = random(50, this.width - 50);
      let y = random(50, this.height * 0.5);

      let count = random(4, 8);

      for (let i = 0; i < count; i++) {
        this.fireworks.push(new Firework(
          this.width / 2,
          this.height,
          x,
          y,
          random(0, 360),
          random(50, 120)
        ));
      }
    }

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      this.fireworks[i].update();
      if (this.fireworks[i].dead) this.fireworks.splice(i, 1);
    }
  }

  draw() {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalCompositeOperation = "lighter";

    this.fireworks.forEach(f => f.draw());
  }

  loop() {
    requestAnimationFrame(() => this.loop());
    this.update();
    this.draw();
  }
}

const birthday = new Birthday();
