const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let animateFrame;
let stopAnimation = false;
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
const x = canvas.width / 2,
  y = canvas.height / 2;

//Player ...>>>>>>

const player = new Player(x, y, 30, "white");
// player.draw();

//Projectile --->>>>>

// const projectile = new Projectile(
//   x,
//   y,
//   10,
//   "red",

//   { x: 1, y: 1 }
// );
const projectiles = [];
const particles = [];
function animateProjectile() {
  projectiles.forEach((element) => {
    element.update();
  });
}

//enemy
const enemies = [];
function spawnEnemies() {
  setInterval(() => {
    const RI = Math.floor(1 + Math.random() * (4 + 1 - 1));
    let x, y;
    switch (RI) {
      case 1:
        // console.log(RI + "RI");
        x = canvas.width + 20;
        y = Math.random() * canvas.height;
        break;
      case 2:
        x = Math.random() * canvas.width;
        y = 0 - 20;
        break;
      // console.log(RI + "RI");
      case 3:
        x = 0 - 20;
        y = Math.random() * canvas.height;
        // console.log(RI + "RI");
        break;
      case 4:
        x = Math.random() * canvas.width;
        y = canvas.height + 20;
        break;
      // console.log(RI + "RI");
    }
    const angel = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angel),
      y: Math.sin(angel),
    };
    // const rad = Math.floor(10 + Math.random() * (40 - 10 + 1));
    const rad = 30;
    if (enemies.length > 0) return;
    const color = `hsl(${Math.random() * 360},50%,50%)`;
    enemies.push(new Enemy(x, y, rad, color, velocity));
  }, 1000);
}
spawnEnemies();
function animateEnemy() {
  enemies.forEach((element) => {
    element.update();
  });
}

// animate function

function animate() {
  c.fillStyle = "rgba(0,0,0,0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  animateProjectile();
  animateEnemy();
  particles.forEach((particle) => {
    particle.draw();
  });
  enemies.forEach((el, i) => {
    // detect enemy collision with player
    const distP = Math.hypot(player.x - el.x, player.y - el.y);
    if (distP - el.radius - player.radius < 0) {
      stopAnimation = true;
    }

    // detect enemy collision with projectile
    projectiles.forEach((pr, j) => {
      const dist = Math.hypot(pr.x - el.x, pr.y - el.y);
      if (dist - el.radius - pr.radius < 0) {
        projectiles.splice(j, 1);

        // create particle Effect
        if( el.x  <= pr.x && -el.y <= -pr.y){
          console.log("cartesian 1");
        }else if(el.x <= pr.x && -el.y >= -pr.y ){
          console.log("cartesian 2")
        }else if(el.x >= pr.x && -el.y >= -pr.y){
          console.log("cartesian 3")
        }else if(el.x >= pr.x && -el.y <= -pr.y ){
          console.log("cartesian 4 ");
        }else{
          console.log("some condition got left")
        }
        stopAnimation = true;
        // particles.push(new Particle(px, py, 5, el.color, { x: 1, y: 1 }));

        //shrink enemy
        if (el.radius - 15 > 8) {
          // el.radius =  10;
          gsap.to(el, {
            radius: el.radius - 10,
          });
          return;
        }
        enemies.splice(i, 1);
      }
    });
  });

  // remove off screen projectiles

  projectiles.forEach((el, i) => {
    // remove horizontal projectile

    if (canvas.width / 2 - el.x - el.radius > 0) {
      if (canvas.width / 2 - el.x - el.radius > canvas.width / 2 - 0) {
        projectiles.splice(i, 1);
      }
    } else {
      if (el.x - canvas.width / 2 - el.radius > canvas.width / 2 - 0) {
        projectiles.splice(i, 1);
      }
    }
    // remove vertical projectile
    if (canvas.height / 2 - el.y - el.radius > 0) {
      if (canvas.height / 2 - el.y - el.radius > canvas.height / 2 - 0) {
        projectiles.splice(i, 1);
      }
    } else {
      if (el.y - canvas.height / 2 - el.radius > canvas.height / 2 - 0) {
        projectiles.splice(i, 1);
      }
    }
  });

  // end
  animateFrame = window.requestAnimationFrame(animate);
  if (stopAnimation) {
    window.cancelAnimationFrame(animateFrame);
  }
}
animate();

//click function
function clickForProjectile(e) {
  const angel = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angel) * 5,
    y: Math.sin(angel) * 5,
  };
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 10, "#fff", velocity)
  );
}
function clickFunction(e) {
  clickForProjectile(e);
}

window.addEventListener("click", (e) => {
  clickFunction(e);
});

//Tester................>>>>>>>>>>>>>>>>>>>>>

// const div = document.querySelector("div");
// function buttonClick(){
//     console.log("button clicked");
//     repeatOften()

// }

// function repeatOften() {
//     // Do whatever
//     console.log("repeating");
//     requestAnimationFrame(repeatOften);
//   }
