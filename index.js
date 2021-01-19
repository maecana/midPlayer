// get canvas from document
const canvas = document.querySelector('canvas');
// set context for canvas
// specify as 2D
const c = canvas.getContext('2d');

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

const x = canvas.width / 2;
const y = canvas.height / 2;

// create player instance
let player = new Player(x, y, 30, 'white');
// invoke draw function
player.draw();

let projectiles = [];
let enemies = [];

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

        let color = 'green';

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

// create looping animation
function animate() {
    requestAnimationFrame(animate);

    // clear canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    // invoke draw function
    player.draw();

    // update projectile or bullet
    projectiles.forEach((projectile) => {
        projectile.update();
    });

    // enemies object drawing
    enemies.forEach((e, eIndex) => {
        e.update();

        // computation for object collision
        projectiles.forEach((projectile, pIndex) => {
            let dist = Math.hypot(
                projectile.x - e.x,
                projectile.y - e.y
            );

            if (dist - e.radius - projectile.radius < 1) {
                enemies.splice(eIndex, 1);
                projectiles.splice(pIndex, 1);
            }
        });
    });
}

// detect click event on the window
addEventListener('click', (e) => {
    let angle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2);

    let velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    }

    let projectile = new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        3, 'red', velocity
    );

    projectiles.push(projectile);
});


animate();
spawnEnemies();