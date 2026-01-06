const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let traces = [];
const traceColor = 'rgba(212, 175, 55, 0.15)'; // Gold, low opacity
const headColor = 'rgba(212, 175, 55, 0.8)';   // Bright gold head

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Trace {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.history = [{x: this.x, y: this.y}];
        this.speed = 2 + Math.random() * 2;
        this.angle = Math.floor(Math.random() * 4) * (Math.PI / 2); // 0, 90, 180, 270 degrees
        this.life = 100 + Math.random() * 100;
        this.turning = 0;
    }

    update() {
        this.life--;
        if (this.life <= 0 || 
            this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
            this.reset();
        }

        // Move
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.history.push({x: this.x, y: this.y});

        // Limit history length
        if (this.history.length > 50) {
            this.history.shift();
        }

        // Turn randomly at 90 degrees
        if (Math.random() < 0.05) {
            this.angle += (Math.random() < 0.5 ? -1 : 1) * (Math.PI / 2);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = traceColor;
        ctx.lineWidth = 2;
        
        if (this.history.length > 0) {
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
        }
        ctx.stroke();

        // Draw Head (Connection Point)
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    const traceCount = Math.floor(window.innerWidth / 20); // Density
    for (let i = 0; i < traceCount; i++) {
        traces.push(new Trace());
    }
}

function animate() {
    // Fade out trail to create "expanding" look without cluttering
    ctx.fillStyle = 'rgba(5, 11, 20, 0.1)'; // Match bg color with opacity
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    traces.forEach(trace => {
        trace.update();
        trace.draw();
    });
    requestAnimationFrame(animate);
}

init();
animate();
