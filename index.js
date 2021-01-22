// get canvas from document
const canvas = document.querySelector('canvas');
// set context for canvas
// specify as 2D
const c = canvas.getContext('2d');
// get score element
const scoreEl = document.querySelector("#scoreEl");
// get modal element
const modalEl = document.querySelector("#modalEl");
// get start button
const startBtn = document.querySelector("#startGameEl");
// get modal score element
const modalScoreEl = document.querySelector("#modalScoreEl");

// set width and height of canvas to body size
canvas.width = innerWidth;
canvas.height = innerHeight;

// create a player class
class Player {
    // take params
    constructor(x, y, radius, color) {
        // set properties
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    // draw the player as a circle
    // set params as properties of circle
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
}

// Create a Projectile class
// This is the player's bullet
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    // draw the projectile as a circle
    // set params as properties of circle
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}


// Create a Enemy class
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    // draw the enemy as a circle
    // set params as properties of circle
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

// Create a Particles class
let friction = 0.99;
class Particles {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    // draw the prarticles as a circle
    // set params as properties of circle
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

// create player instance
let player = new Player(x, y, 10, 'white');
// invoke draw function
player.draw();

let projectiles = [];
let enemies = [];
let particles = [];

// initialize all vars and objs
function init() {
    player = new Player(x, y, 10, 'white');
    projectiles = [];
    enemies = [];
    particles = [];

    score = 0;
    scoreEl.innerHTML = 0;
}

// function for spawning enemies
function spawnEnemies() {
    setInterval(() => {
        let radius = Math.random() * (30 - 5) + 5;
        let x;
        let y;

        if (Math.random() < 0.5) {
            // if x is spawned from 0 left or 0 right
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            // y should be anywhere in between
            y = Math.random() * canvas.height;
        } else {
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            x = Math.random() * canvas.width;
        }

        let color = `hsl(${Math.random() * 360}, 50%, 50%)`;

        // compute for velocity of this object
        // getting the angle
        let angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x);

        // getting distance for x and y
        let velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };

        // initialize new Enemy object
        let enemy = new Enemy(x, y, radius, color, velocity);
        enemies.push(enemy);

    }, 1000);
}

let animationId;
let score = 0;

// create looping animation
function animate() {
    animationId = requestAnimationFrame(animate);

    // clear canvas
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // invoke draw function
    player.draw();

    // update projectile or bullet
    projectiles.forEach((projectile, index) => {
        projectile.update();

        // remove project off screen
        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(projectile, 1);
            }, 0);
        }
    });

    // enemies object drawing
    enemies.forEach((e, eIndex) => {
        e.update();

        const dist = Math.hypot(
            player.y - e.y,
            player.x - e.x
        )

        // end game
        if ( (dist - player.radius - e.radius) < 1 ) {
            console.log("%c [ SpawnEnemies ] - Ending Game...",
            "font-size: 16px; font-bold: bold; color: violet;");
            cancelAnimationFrame(animationId);

            // show restart modal
            modalScoreEl.innerHTML = score;
            modalEl.style.display = 'flex';
        }

        // object collision
        projectiles.forEach((projectile, pIndex) => {
            let dist = Math.hypot(
                projectile.x - e.x,
                projectile.y - e.y
            );

            if (dist - e.radius - projectile.radius < 1) {
                let particle_count = e.radius * 2;
                for(let i = 0; i < particle_count; i++) {
                    particles.push(
                        new Particles(
                            projectile.x,
                            projectile.y,
                            Math.random() * 2,
                            e.color,
                            {
                                x: (Math.random() - 0.5) * (Math.random() * 6),
                                y: (Math.random() - 0.5) * (Math.random() * 6)
                            }
                        )
                    )
                }

                if (e.radius - 10 > 5) {
                    score += 100;
                    gsap.to(e, {
                        radius: e.radius - 10
                    });
                    setTimeout(() => {
                        projectiles.splice(pIndex, 1);
                    }, 0);
                } else {
                    score += 250;
                    setTimeout(() => {
                        enemies.splice(eIndex, 1);
                        projectiles.splice(pIndex, 1);
                    }, 0);
                }
                scoreEl.innerHTML = score;
            }
        });
    });

    // invoke update particles
    particles.forEach((particle, partIndex) => {
        if (particle.alpha <= 0.1) {
            setTimeout(() => {
                particles.splice(partIndex, 1);
            }, 0);
        }
        particle.update();
    });
}

// detect click event on the window
addEventListener('click', (e) => {
    let angle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2);

    let velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4,
    }

    let projectile = new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        3, 'white', velocity
    );

    projectiles.push(projectile);
});

startBtn.addEventListener('click', (e) => {
    modalEl.style.display = 'none';
    init();
    animate();
    spawnEnemies();
});
