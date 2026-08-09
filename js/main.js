// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Loader & Page Transitions
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    
    // Fade out loader on page load
    if (loader) {
        // Add a slight delay to ensure visual smoothness
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.visibility = 'hidden';
            }, 400); // matches the transition duration in CSS
        }, 600);
    }

    // Intercept internal page transitions to show loader
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        // Check if link is a local HTML page (and not a fragment identifier, external URL or telephone/whatsapp links)
        if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (loader) {
                    loader.style.visibility = 'visible';
                    loader.style.opacity = '1';
                    setTimeout(() => {
                        window.location.href = href;
                    }, 400); // Allow time for loader to fully fade in
                } else {
                    window.location.href = href;
                }
            });
        }
    });

    // Run active page indicator check
    highlightActiveNav();

    // Initialize Scroll Animations & Counters
    initScrollAnimations();
    initCounters();
    initEnergyCanvas();
});

// Highlight the active page in the navbar
function highlightActiveNav() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentFile) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-overlay');
    const icon = document.getElementById('menu-icon');
    
    if (!menu) return;

    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        if (overlay) overlay.classList.add('hidden');
        if (icon) icon.setAttribute('data-lucide', 'menu');
    } else {
        menu.classList.add('open');
        if (overlay) overlay.classList.remove('hidden');
        if (icon) icon.setAttribute('data-lucide', 'x');
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
window.toggleMobileMenu = toggleMobileMenu;

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    }
});

// Energy Canvas Particles Animation
function initEnergyCanvas() {
    const canvas = document.getElementById('energy-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resizeCanvas() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.energy = Math.random() * 100;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.energy += 0.02;
            
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 106, 0, ${this.alpha * Math.abs(Math.sin(this.energy))})`;
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 106, 0, ${0.1 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    resizeCanvas();
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// GSAP Scroll Animations
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    
    // Stagger items fade-in
    gsap.utils.toArray('.stagger-item').forEach((item, i) => {
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                once: true
            }
        });
    });
    
    // Service cards slide-up
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true
            }
        });
    });
    
    // Product cards slide-up
    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.5,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 95%',
                once: true
            }
        });
    });
}

// Counter Numbers Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    if (!counters.length) return;

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Form Handling
function handleFormSubmit(e) {
    e.preventDefault();
    showToast('Thank you! Your message has been sent successfully. We will get back to you shortly.');
    e.target.reset();
}
window.handleFormSubmit = handleFormSubmit;

// Toast Notifications
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 4000);
}
window.showToast = showToast;

// Toggle mobile products/services dropdown
function toggleMobileDropdown(submenuId, arrowId) {
    const submenu = document.getElementById(submenuId);
    const arrow = document.getElementById(arrowId || 'mobile-products-arrow');
    if (!submenu) return;
    
    if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        submenu.classList.add('flex');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        submenu.classList.remove('flex');
        submenu.classList.add('hidden');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}
window.toggleMobileDropdown = toggleMobileDropdown;

