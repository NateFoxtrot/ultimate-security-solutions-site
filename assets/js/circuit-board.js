const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let w, h;
let grid = 15; // Tighter grid for more detail
let paths = []; // Fixed paths
let pulses = [];

const CONFIG = {
    pathColor: 'rgba(14, 165, 233, 0.08)', // Very faint structure
    pulseColor: '#ffd700', // Gold
    nodeCount: 150, // More nodes
    connectionRadius: 200,
    pulseSpeed: 3
};

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initNetwork();
}
window.addEventListener('resize', resize);

class Path {
    constructor(x1, y1, x2, y2) {
        this.path = [];
        this.generateOrthogonal(x1, y1, x2, y2);
    }

    generateOrthogonal(x1, y1, x2, y2) {
        // Simple L-shape routing
        this.path.push({x: x1, y: y1});
        if (Math.random() > 0.5) {
            this.path.push({x: x2, y: y1}); // Horizontal first
        } else {
            this.path.push({x: x1, y: y2}); // Vertical first
        }
        this.path.push({x: x2, y: y2});
    }

    draw() {
        ctx.strokeStyle = CONFIG.pathColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        for(let i=1; i<this.path.length; i++) {
            ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        ctx.stroke();
        
        // Draw nodes
        ctx.fillStyle = CONFIG.pathColor;
        ctx.beginPath();
        ctx.arc(this.path[0].x, this.path[0].y, 2, 0, Math.PI*2);
        ctx.arc(this.path[this.path.length-1].x, this.path[this.path.length-1].y, 2, 0, Math.PI*2);
        ctx.fill();
    }
}

class Pulse {
    constructor(path) {
        this.path = path.path;
        this.segment = 0;
        this.progress = 0;
        this.dead = false;
        
        // Calculate total length for speed consistency
        this.speed = 0.05 + Math.random() * 0.05;
    }

    update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
            this.progress = 0;
            this.segment++;
            if (this.segment >= this.path.length - 1) {
                this.dead = true;
            }
        }
    }

    draw() {
        if (this.dead) return;
        
        let p1 = this.path[this.segment];
        let p2 = this.path[this.segment + 1];
        
        let x = p1.x + (p2.x - p1.x) * this.progress;
        let y = p1.y + (p2.y - p1.y) * this.progress;

        ctx.fillStyle = CONFIG.pulseColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = CONFIG.pulseColor;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function initNetwork() {
    paths = [];
    pulses = [];
    
    let nodes = [];
    // Create nodes concentrated in center
    for (let i = 0; i < CONFIG.nodeCount; i++) {
        // Bias towards center
        let x = w/2 + (Math.random() - 0.5) * w * 0.8;
        let y = h/2 + (Math.random() - 0.5) * h * 0.8;
        
        // Snap to grid
        x = Math.floor(x / grid) * grid;
        y = Math.floor(y / grid) * grid;
        nodes.push({x, y});
    }

    // Connect nodes
    nodes.forEach((node, i) => {
        // Connect to nearest neighbors
        let neighbors = nodes.filter(n => {
            let d = Math.sqrt((n.x - node.x)**2 + (n.y - node.y)**2);
            return d > 0 && d < CONFIG.connectionRadius;
        });
        
        // Limit connections per node
        neighbors.slice(0, 3).forEach(n => {
            paths.push(new Path(node.x, node.y, n.x, n.y));
        });
    });
}

function animate() {
    ctx.clearRect(0, 0, w, h);

    // Draw static background structure
    paths.forEach(p => p.draw());

    // Spawn pulses
    if (pulses.length < 30 && Math.random() < 0.1) {
        let randomPath = paths[Math.floor(Math.random() * paths.length)];
        pulses.push(new Pulse(randomPath));
    }

    // Animate pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].update();
        pulses[i].draw();
        if (pulses[i].dead) {
            pulses.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Start
resize();
animate();