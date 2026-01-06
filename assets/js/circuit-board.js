const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let w, h;
let grid = 20; // Grid size
let paths = [];
let walkers = [];

const CONFIG = {
    traceColor: 'rgba(14, 165, 233, 0.1)', // Faint Blue
    pulseColor: '#ffd700', // Gold
    pulseSpeed: 1, // Steps per frame
    maxWalkers: 50,
    spawnRate: 0.05
};

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    // Reset on resize
    ctx.clearRect(0, 0, w, h);
    paths = [];
    walkers = [];
}
window.addEventListener('resize', resize);
resize();

class Walker {
    constructor(x, y) {
        this.x = x || Math.floor(Math.random() * (w / grid)) * grid;
        this.y = y || Math.floor(Math.random() * (h / grid)) * grid;
        this.history = [{x: this.x, y: this.y}];
        this.dead = false;
        this.dir = Math.floor(Math.random() * 4); // 0: right, 1: down, 2: left, 3: up
        this.life = Math.random() * 100 + 50;
        this.color = CONFIG.pulseColor;
    }

    update() {
        if (this.dead) return;
        this.life--;

        if (this.life <= 0 || this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
            this.dead = true;
            // Persist the path
            paths.push([...this.history]);
            return;
        }

        // Randomly turn
        if (Math.random() < 0.1) {
            this.dir = (this.dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        }

        switch (this.dir) {
            case 0: this.x += grid; break;
            case 1: this.y += grid; break;
            case 2: this.x -= grid; break;
            case 3: this.y -= grid; break;
        }

        this.history.push({x: this.x, y: this.y});
    }

    draw(ctx) {
        if (this.dead) return;
        
        // Draw Head (Pulse)
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw current trail
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (this.history.length > 0) {
            let start = this.history[this.history.length - 2] || this.history[0];
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(this.x, this.y);
        }
        ctx.stroke();
    }
}

function init() {
    walkers = [];
    paths = [];
    ctx.clearRect(0, 0, w, h);
}

function animate() {
    // Fade existing paths slightly to background
    // We don't clearRect completely to leave trails, but we want old "dead" paths to stay visible as faint traces
    
    // 1. Draw Faint Background over everything to fade active pulses, but we want traces to persist?
    // Strategy: Clear, Draw Saved Paths (Faint), Draw Active Walkers (Bright)
    
    ctx.clearRect(0, 0, w, h);

    // Draw Persistent Paths (The "Circuit Board" building up)
    ctx.strokeStyle = CONFIG.traceColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    paths.forEach(path => {
        if (path.length < 2) return;
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
    });
    ctx.stroke();

    // Spawn new walkers
    if (walkers.length < CONFIG.maxWalkers && Math.random() < CONFIG.spawnRate) {
        walkers.push(new Walker());
    }

    // Update and Draw Walkers (The "Pulses")
    for (let i = walkers.length - 1; i >= 0; i--) {
        let walker = walkers[i];
        walker.update();
        walker.draw(ctx);
        if (walker.dead) {
            walkers.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Initial Spawn from center
setTimeout(() => {
    for(let i=0; i<10; i++) {
        walkers.push(new Walker(w/2, h/2));
    }
}, 100);

animate();
