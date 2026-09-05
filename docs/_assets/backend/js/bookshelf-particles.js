/* Firefly field behind the page content. ~24 motes that fly slowly with
   noisy/irregular headings, occasionally land (preferring the empty side
   margins outside the centered content column), idle-flicker there a
   while, then take off again. Glow = sine "breathing" mixed with noise
   flicker. Takeoff/landing motion is jitterier than cruising flight. */
new p5(sk => {
  const N = 24;
  let flies = [];

  class Firefly {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = sk.random(sk.width);
      this.y = sk.random(sk.height);
      this.heading = sk.random(sk.TWO_PI);
      this.speed = sk.random(0.35, 0.75);
      this.state = "flying";
      this.timer = sk.random(150, 360);
      this.seed = sk.random(1000);
      this.sinePhase = sk.random(sk.TWO_PI);
      this.sineSpeed = sk.random(0.01, 0.025);
      this.target = null;
    }
    pickRestTarget() {
      const margin = Math.max(0, (sk.width - 1080) / 2);
      let x;
      if (margin > 60 && sk.random() < 0.75) {
        x = sk.random() < 0.5 ? sk.random(0, margin * 0.85) : sk.random(sk.width - margin * 0.85, sk.width);
      } else {
        x = sk.random(sk.width);
      }
      return { x, y: sk.random(sk.height * 0.1, sk.height * 0.92) };
    }
    wrap() {
      if (this.x < -10) this.x = sk.width + 10;
      if (this.x > sk.width + 10) this.x = -10;
      if (this.y < -10) this.y = sk.height + 10;
      if (this.y > sk.height + 10) this.y = -10;
    }
    update(t) {
      const n = sk.noise(this.seed + t * 0.01);
      if (this.state === "flying") {
        this.heading += (n - 0.5) * 0.22;
        this.x += Math.cos(this.heading) * this.speed;
        this.y += Math.sin(this.heading) * this.speed;
        this.wrap();
        if (--this.timer <= 0) {
          this.target = this.pickRestTarget();
          this.state = "landing";
          this.timer = 60 + sk.random(40);
        }
      } else if (this.state === "landing") {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);
        this.heading = Math.atan2(dy, dx) + (n - 0.5) * 0.6;
        const spd = Math.min(this.speed, dist * 0.05) + 0.05;
        this.x += Math.cos(this.heading) * spd;
        this.y += Math.sin(this.heading) * spd;
        if (dist < 6 || --this.timer <= 0) {
          this.state = "resting";
          this.timer = sk.random(90, 240);
        }
      } else if (this.state === "resting") {
        this.x += (n - 0.5) * 0.15;
        this.y += (sk.noise(this.seed + 500 + t * 0.01) - 0.5) * 0.15;
        if (--this.timer <= 0) {
          this.state = "takeoff";
          this.heading = sk.random(sk.TWO_PI);
          this.timer = 40;
        }
      } else if (this.state === "takeoff") {
        this.heading += (n - 0.5) * 0.7;
        const spd = Math.max(this.speed * (1 - this.timer / 40), 0.1);
        this.x += Math.cos(this.heading) * spd;
        this.y += Math.sin(this.heading) * spd;
        this.wrap();
        if (--this.timer <= 0) {
          this.state = "flying";
          this.timer = sk.random(150, 360);
        }
      }
    }
    show(t) {
      const breathing = 0.5 + 0.5 * Math.sin(t * this.sineSpeed + this.sinePhase);
      const flicker = sk.noise(this.seed + 50 + t * 0.04);
      const glow = breathing * 0.6 + flicker * 0.4;
      const alpha = 30 + glow * 170;
      const r = 1.6 + glow * 2.2;

      sk.noStroke();
      sk.fill(212, 190, 110, alpha * 0.35);
      sk.ellipse(this.x, this.y, r * 4, r * 4);
      sk.fill(230, 210, 150, alpha);
      sk.ellipse(this.x, this.y, r, r);
    }
  }

  sk.setup = () => {
    const c = sk.createCanvas(sk.windowWidth, sk.windowHeight);
    c.parent("p5wrap");
    for (let i = 0; i < N; i++) flies.push(new Firefly());
  };
  sk.draw = () => {
    sk.clear();
    const t = sk.frameCount;
    flies.forEach(f => {
      f.update(t);
      f.show(t);
    });
  };
  sk.windowResized = () => sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
}, document.getElementById("p5wrap"));
