const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let w, h;
let particles = [];
let connections = [];

// Configuration
const CONFIG = {
    particleCount: 60,
    connectionDist: 150,
    baseColor: 'rgba(14, 165, 233, 0.15)', // Faint Sky Blue traces (Slate theme accent)
    pulseColor: '#ffd700', // Gold pulses
    pulseSpeed: 2,
    nodeSpeed: 0.2
};

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * CONFIG.nodeSpeed;
        this.vy = (Math.random() - 0.5) * CONFIG.nodeSpeed;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = CONFIG.baseColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Pulse {
    constructor(startNode, endNode) {
        this.start = startNode;
        this.end = endNode;
        this.progress = 0;
        this.speed = CONFIG.pulseSpeed / this.getDist();
        this.dead = false;
    }

    getDist() {
        let dx = this.start.x - this.end.x;
        let dy = this.start.y - this.end.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
            this.progress = 1;
            this.dead = true;
        }
    }

    draw() {
        let x = this.start.x + (this.end.x - this.start.x) * this.progress;
        let y = this.start.y + (this.end.y - this.start.y) * this.progress;

        ctx.fillStyle = CONFIG.pulseColor;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = CONFIG.pulseColor;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

let pulses = [];

function init() {
    particles = [];
    let count = Math.floor((w * h) / 15000); // Responsive density
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, w, h);

    // Update and Draw Particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw Connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let p1 = particles[i];
            let p2 = particles[j];
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.connectionDist) {
                // Draw Trace
                ctx.strokeStyle = CONFIG.baseColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                // Randomly spawn a pulse
                if (Math.random() < 0.002) {
                    pulses.push(new Pulse(p1, p2));
                }
            }
        }
    }

    // Update and Draw Pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].update();
        pulses[i].draw();
        if (pulses[i].dead) {
            pulses.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

init();
animate();