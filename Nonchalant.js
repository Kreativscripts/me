document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // ENHANCED VIEW COUNTER SYSTEM WITH RANDOM GROWTH
    // ======================
    const initializeViewCounter = () => {
        // Initialize counter if not set
        if (!localStorage.getItem('globalViewCount')) {
            localStorage.setItem('globalViewCount', '1000'); // Start at 1000
        }
        
        // Get current count
        let currentCount = parseInt(localStorage.getItem('globalViewCount'));
        
        // Check if we've counted this session
        if (!sessionStorage.getItem('viewCounted')) {
            // Increment count by 1 for the actual view
            currentCount++;
            localStorage.setItem('globalViewCount', currentCount.toString());
            sessionStorage.setItem('viewCounted', 'true');
        }
        
        // Update all counters on the page
        const updateCounters = (count) => {
            document.querySelectorAll('.count-number').forEach(el => {
                el.textContent = count.toLocaleString();
                el.classList.add('count-update');
                setTimeout(() => el.classList.remove('count-update'), 500);
            });
        };
        
        updateCounters(currentCount);
        
        // Random growth simulation
        const simulateGrowth = () => {
            const randomIncrement = Math.floor(Math.random() * 5) + 1; // 1-5
            let newCount = currentCount + randomIncrement;
            
            // Reset to 1000 if over 1 million
            if (newCount > 1000000) {
                newCount = 1000;
            }
            
            currentCount = newCount;
            localStorage.setItem('globalViewCount', currentCount.toString());
            updateCounters(currentCount);
            
            // Sync with other tabs
            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('view_counter');
                channel.postMessage({type: 'update', count: currentCount});
            }
        };
        
        // Start growth simulation (every 3 seconds)
        setInterval(simulateGrowth, 3000);
        
        // Listen for updates from other tabs
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('view_counter');
            channel.addEventListener('message', (event) => {
                if (event.data.type === 'update') {
                    currentCount = event.data.count;
                    localStorage.setItem('globalViewCount', currentCount.toString());
                    updateCounters(currentCount);
                }
            });
        }
    };

    // ======================
    // SYNCED LIKE COUNTER SYSTEM
    // ======================
    const initializeLikeCounter = () => {
        if (!localStorage.getItem('globalLikeCount')) {
            localStorage.setItem('globalLikeCount', '0');
        }
        
        document.querySelectorAll('#likesCount').forEach(el => {
            el.textContent = localStorage.getItem('globalLikeCount');
        });
        
        const likeBtn = document.getElementById('likeBtn');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                if (!localStorage.getItem('hasLiked')) {
                    const currentLikes = parseInt(localStorage.getItem('globalLikeCount'));
                    const newLikes = currentLikes + 1;
                    localStorage.setItem('globalLikeCount', newLikes.toString());
                    localStorage.setItem('hasLiked', 'true');
                    
                    document.querySelectorAll('#likesCount').forEach(el => {
                        el.textContent = newLikes;
                        el.classList.add('like-update');
                        setTimeout(() => el.classList.remove('like-update'), 500);
                    });
                    
                    likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
                    likeBtn.classList.add('liked');
                    likeBtn.style.animation = 'heartBeat 0.5s';
                    setTimeout(() => likeBtn.style.animation = '', 500);
                }
            });
        }
    };

    // ======================
    // CUSTOM CURSOR SYSTEM
    // ======================
    const initializeCustomCursor = () => {
        // Create custom cursor element
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.style.position = 'fixed';
        cursor.style.width = '32px';
        cursor.style.height = '32px';
        cursor.style.backgroundImage = 'url("https://cdn.discordapp.com/attachments/1358682886102061116/1370648255142297620/katana.png")';
        cursor.style.backgroundSize = 'contain';
        cursor.style.backgroundRepeat = 'no-repeat';
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '99999';
        cursor.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(cursor);

        // Hide default cursor
        document.body.style.cursor = 'none';

        // Move custom cursor
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // Add active state for clickable elements
        const clickableElements = ['a', 'button', '[role="button"]', 'input', 'textarea', 'select', 'label[for]'];
        
        document.addEventListener('mouseover', (e) => {
            const isClickable = clickableElements.some(selector => 
                e.target.matches(selector) || e.target.closest(selector)
            );
            
            if (isClickable) {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.3)';
                cursor.style.filter = 'drop-shadow(0 0 5px #00ffff)';
            } else {
                cursor.style.transform = 'translate(-50%, -50%)';
                cursor.style.filter = 'none';
            }
        });
    };

    // ======================
    // INITIALIZE SYSTEMS
    // ======================
    initializeViewCounter();
    initializeLikeCounter();
    initializeCustomCursor();

    // ======================
    // LOADER AND ANIMATIONS
    // ======================
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }, 1500);

    // ======================
    // BLACK AND WHITE PARTICLES
    // ======================
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    const colors = ['#ffffff', '#dddddd', '#bbbbbb', '#999999', '#777777', '#555555', '#333333', '#000000'];
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = 100;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.1) this.size -= 0.05;
            this.life--;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].size <= 0.1 || particles[i].life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
    }
    
    window.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(animate);
    }
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // About Me button transition
    const aboutMeBtn = document.getElementById('aboutMeBtn');
    if (aboutMeBtn) {
        aboutMeBtn.addEventListener('click', function() {
            const flash = document.createElement('div');
            flash.className = 'flash-effect';
            document.body.appendChild(flash);
            flash.style.animation = 'flash 1s';
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 1000);
        });
    }
});