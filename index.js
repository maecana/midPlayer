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

const x = canvas.width / 2;
const y = canvas.height / 2;

// create player instance
let player = new Player(x, y, 30, 'white');
// invoke draw function
player.draw();

let projectiles = [];

// create looping animation
function animate() {
    requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);
    // invoke draw function
    player.draw();
    
    projectiles.forEach((projectile)=> {
        projectile.update();
    });

    console.log('go');
}

// detect click event on the window
addEventListener('click', (e) => {
    console.log(e.clientX, e.clientY);

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

    animate();

    console.log(projectile);
});
