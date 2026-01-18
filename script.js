document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    createParticles();

    setupEventListeners();

    setTimeout(() => {
        createConfetti(30);
    }, 500);
}

function setupEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const musicBtn = document.getElementById('musicBtn');
    const confettiBtn = document.getElementById('confettiBtn');
    const fireworksBtn = document.getElementById('fireworksBtn');
    const balloonsBtn = document.getElementById('balloonsBtn');

    startBtn.addEventListener('click', startCelebration);
    musicBtn.addEventListener('click', toggleMusic);
    confettiBtn.addEventListener('click', () => createConfetti(50));
    fireworksBtn.addEventListener('click', launchFireworks);
    balloonsBtn.addEventListener('click', () => createBalloons(10));
}

function startCelebration() {
    const welcomeScreen = document.getElementById('welcome');
    const celebrationScreen = document.getElementById('celebration');
    const audio = document.getElementById('birthdayMusic');
    const musicBtn = document.getElementById('musicBtn');
    const musicText = musicBtn.querySelector('.music-text');

    welcomeScreen.classList.add('hidden');

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicText.textContent = 'Pause Music';
            musicBtn.classList.add('playing');
        }).catch(error => {
            console.log('Audio auto-play prevented by browser:', error);
        });
    }

    setTimeout(() => {
        celebrationScreen.classList.add('active');

        createConfetti(100);

        createBalloons(15);

        setTimeout(() => {
            launchFireworks();
        }, 1000);
    }, 800);
}

function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particle.style.left = `${Math.random() * 100}%`;

        const duration = Math.random() * 10 + 10;
        particle.style.animationDuration = `${duration}s`;

        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;

        container.appendChild(particle);
    }
}

function createConfetti(count) {
    const container = document.getElementById('confetti');
    const colors = [
        '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3',
        '#54a0ff', '#00d2d3', '#f368e0', '#ff9f43',
        '#ee5a6f', '#c7ecee', '#a29bfe', '#fd79a8'
    ];

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = color;

        confetti.style.left = `${Math.random() * 100}%`;

        const size = Math.random() * 8 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;

        if (Math.random() > 0.5) {
            confetti.style.height = `${size * 1.5}px`;
        }

        const duration = Math.random() * 2 + 2;
        confetti.style.animationDuration = `${duration}s`;

        const delay = Math.random() * 0.5;
        confetti.style.animationDelay = `${delay}s`;

        container.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, (duration + delay) * 1000);
    }
}

function createBalloons(count) {
    const container = document.getElementById('balloons');
    const colors = [
        '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3',
        '#54a0ff', '#00d2d3', '#f368e0', '#ff9f43'
    ];

    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';

        const color = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.background = `linear-gradient(135deg, ${color}, ${adjustBrightness(color, -20)})`;
        balloon.style.boxShadow = `0 10px 30px ${color}40`;

        balloon.style.left = `${Math.random() * 90 + 5}%`;

        const duration = Math.random() * 3 + 4;
        balloon.style.animationDuration = `${duration}s`;

        const delay = Math.random() * 2;
        balloon.style.animationDelay = `${delay}s`;

        container.appendChild(balloon);

        setTimeout(() => {
            balloon.remove();
        }, (duration + delay) * 1000);
    }
}

function adjustBrightness(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}


let fireworksActive = false;
let fireworksAnimationId = null;

function launchFireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];
    const particles = [];

    if (fireworksActive) {
        fireworksActive = false;
        if (fireworksAnimationId) {
            cancelAnimationFrame(fireworksAnimationId);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    fireworksActive = true;

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.5;
            this.velocity = -8;
            this.acceleration = 0.05;
            this.exploded = false;
            this.hue = Math.random() * 360;
        }

        update() {
            if (!this.exploded) {
                this.velocity += this.acceleration;
                this.y += this.velocity;

                if (this.y <= this.targetY) {
                    this.exploded = true;
                    this.explode();
                }
            }
        }

        draw() {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
                ctx.fill();

                // Trail
                ctx.beginPath();
                ctx.arc(this.x, this.y + 10, 2, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, 0.5)`;
                ctx.fill();
            }
        }

        explode() {
            const particleCount = 100;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(this.x, this.y, this.hue));
            }
        }
    }

    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.hue = hue + Math.random() * 50 - 25;
            this.angle = Math.random() * Math.PI * 2;
            this.velocity = Math.random() * 5 + 2;
            this.vx = Math.cos(this.angle) * this.velocity;
            this.vy = Math.sin(this.angle) * this.velocity;
            this.life = 100;
            this.decay = Math.random() * 2 + 1;
        }

        update() {
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.vy += 0.1; // Gravity
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.life / 100})`;
            ctx.fill();
        }
    }

    function animate() {
        if (!fireworksActive) return;

        ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.05) {
            fireworks.push(new Firework());
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();

            if (fireworks[i].exploded) {
                fireworks.splice(i, 1);
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }

        fireworksAnimationId = requestAnimationFrame(animate);
    }

    animate();

    setTimeout(() => {
        fireworksActive = false;
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 2000);
    }, 10000);
}

function toggleMusic() {
    const audio = document.getElementById('birthdayMusic');
    const musicBtn = document.getElementById('musicBtn');
    const musicText = musicBtn.querySelector('.music-text');

    if (audio.paused) {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicText.textContent = 'Pause Music';
                musicBtn.classList.add('playing');
            }).catch(error => {
                console.log('Audio playback prevented:', error);
                alert('Please add an audio file (birthday-song.mp3) to enable music!');
            });
        }
    } else {
        audio.pause();
        musicText.textContent = 'Play Music';
        musicBtn.classList.remove('playing');
    }
}

window.addEventListener('resize', function () {
    const canvas = document.getElementById('fireworks');
    if (fireworksActive) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

const cakeCard = document.querySelector('.cake-card');
if (cakeCard) {
    cakeCard.addEventListener('mousemove', function (e) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.width = '5px';
        sparkle.style.height = '5px';
        sparkle.style.background = 'white';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkle-fade 0.5s ease-out forwards';
        sparkle.style.zIndex = '1000';

        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 500);
    });
}

const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle-fade {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('keydown', function (e) {
    if (e.key === 'c' || e.key === 'C') {
        createConfetti(50);
    }
    if (e.key === 'f' || e.key === 'F') {
        launchFireworks();
    }
    if (e.key === 'b' || e.key === 'B') {
        createBalloons(10);
    }
    if (e.key === 'm' || e.key === 'M') {
        toggleMusic();
    }
});

console.log('%c🎉 Happy Birthday! 🎉', 'font-size: 30px; color: #ff6b6b; font-weight: bold;');
console.log('%cKeyboard Shortcuts:\n- C: Confetti\n- F: Fireworks\n- B: Balloons\n- M: Music', 'font-size: 14px; color: #48dbfb;');
