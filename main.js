// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

// GSAP & Lenis Integration
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Background Particles
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const particlesContainer = document.querySelector('#particles-js');
particlesContainer.appendChild(canvas);

let particles = [];
function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    const count = window.innerWidth < 768 ? 25 : 50; // Fewer particles on mobile
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();
window.addEventListener('resize', initParticles);

// Preloader Logic
window.addEventListener('load', () => {
    const loader = document.querySelector('#loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }, 1500);
});

// Custom Cursor (Desktop Only)
const cursorDot = document.querySelector('.cursor-dot');
const cursorFollower = document.querySelector('.cursor-follower');
if (window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
        const { clientX: x, clientY: y } = e;
        gsap.to(cursorDot, { x, y, duration: 0 });
        gsap.to(cursorFollower, { x, y, duration: 0.5, ease: 'power2.out' });
    });
} else {
    cursorDot.style.display = 'none';
    cursorFollower.style.display = 'none';
}

// Universal Modal System
const modal = document.querySelector('#attraction-modal');
const modalImg = document.querySelector('#modal-img');
const modalTitle = document.querySelector('#modal-title');
const modalDesc = document.querySelector('#modal-desc');
const modalTag = document.querySelector('#modal-tag');
const modalClose = document.querySelector('.modal-close');

const interactables = document.querySelectorAll('.culture-card, .attraction-card, .city-card, .inst-card, .food-item, .timeline-item, .timeline-content, .image-wrapper, .image-wrapper img');

interactables.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
        const h3 = el.querySelector('h3');
        const p = el.querySelector('p');
        const img = el.tagName === 'IMG' ? el : el.querySelector('img');
        const tag = el.querySelector('.section-tag');

        modalImg.src = img ? img.src : 'hero.png';
        modalTitle.innerText = h3 ? h3.innerText : (img ? img.alt : 'Andhra Pradesh');
        modalDesc.innerText = p ? p.innerText : 'Discover the hidden gems and vibrant history of Andhra Pradesh.';
        modalTag.innerText = tag ? tag.innerText : 'Explore';

        modal.style.display = 'flex';
        gsap.to(modal, { opacity: 1, duration: 0.5 });
        gsap.to('.modal-content', {
            scale: 1,
            duration: 0.5,
            ease: window.innerWidth < 768 ? 'power2.out' : 'power3.out'
        });
    });
});

modalClose.addEventListener('click', () => {
    gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.style.display = 'none' });
    gsap.to('.modal-content', { scale: 0.9, duration: 0.3 });
});

// Interactive Map Hotspots
const hotspots = document.querySelectorAll('.hotspot');
const mapCard = document.querySelector('#map-card');
const cityData = {
    'Visakhapatnam': { desc: 'The Jewel of the East Coast.', img: 'cities/Visakhapatnam.jpg' },
    'Tirupati': { desc: 'The spiritual heart of India.', img: 'cities/Tirupati.jpg' },
    'Araku Valley': { desc: 'A misty hill station in the Eastern Ghats.', img: 'explore/araku valley.jpg' },
    'Vijayawada': { desc: 'The commercial nerve center of Andhra.', img: 'cities/Vijayawada.jpg' },
    'Srikalahasti Temple': { desc: 'Renowned for its massive, intricate temple structure, often called the Kalahastiswara temple.', img: 'explore/Srikalahasti Temple.jpg' },
    'Borra Caves': { desc: '80-meter deep limestone caves in the Araku Valley featuring stunning stalactite and stalagmite formations.', img: 'explore/Borra Caves.jpg' },
    'Lambasingi': { desc: 'Known as the "Kashmir of Andhra Pradesh," this is the only place in the state where temperatures can drop to near freezing.', img: 'explore/Lambasingi.webp' },
    'Lepakshi Temple': { desc: 'A Vijayanagara wonder with the iconic hanging pillar and ceilings painted with flowing gods and demons.', img: 'explore/lepakshi temple.webp' },
    'INS Kursura Museum': { desc: 'A decommissioned Soviet-built submarine turned into an immersive museum on the shores of Vizag.', img: 'explore/INS kursura.jpg' }
};

hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
        const city = spot.getAttribute('data-city');
        document.querySelector('#card-title').innerText = city;
        document.querySelector('#card-desc').innerText = cityData[city].desc;
        document.querySelector('#card-img').src = cityData[city].img;
        mapCard.classList.add('active');
    });
});
document.querySelector('.card-close').addEventListener('click', () => mapCard.classList.remove('active'));

// MatchMedia for Adaptive Logic
let mm = gsap.matchMedia();

mm.add({
    isDesktop: "(min-width: 769px)",
    isMobile: "(max-width: 768px)"
}, (context) => {
    let { isDesktop, isMobile } = context.conditions;

    // Hero Reveal
    gsap.to('.hero-title span', {
        opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
        duration: 1.2, stagger: 0.08, ease: 'power4.out', delay: 1
    });

    // Cities Horizontal Scroll
    const citiesContainer = document.querySelector('.cities-container');
    const cityCards = document.querySelectorAll('.city-card');

    gsap.to(citiesContainer, {
        x: () => -(citiesContainer.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: '#cities',
            start: 'top top',
            end: () => `+=${citiesContainer.scrollWidth * (isMobile ? 1.2 : 1)}`,
            scrub: isMobile ? 0.5 : 1, // Faster scrub on mobile
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
                const center = window.innerWidth / 2;
                cityCards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const distance = Math.abs(center - (rect.left + rect.width / 2));
                    const proximity = Math.max(0, 1 - (distance / (window.innerWidth * (isMobile ? 0.8 : 0.5))));
                    gsap.set(card, {
                        scale: isMobile ? (0.9 + proximity * 0.15) : (0.85 + proximity * 0.25),
                        opacity: isMobile ? (0.7 + proximity * 0.3) : (0.5 + proximity * 0.5),
                        filter: isMobile ? 'none' : `blur(${(1 - proximity) * 3}px)` // Disable blur on mobile for perf
                    });
                });
            }
        }
    });

    // Reveal Animations
    const revealSelectors = '.culture-card, .food-item, .inst-card, .fact-card, .timeline-item';
    gsap.from(revealSelectors, {
        opacity: 0,
        y: isMobile ? 20 : 30,
        stagger: isMobile ? 0.05 : 0.1,
        duration: isMobile ? 0.8 : 1,
        scrollTrigger: {
            trigger: 'section',
            start: isMobile ? 'top 90%' : 'top 80%'
        }
    });

    return () => {
        // Cleanup if needed
    };
});

// Nav Routing & ScrollSpy
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -80, duration: 2 });
    });
});

// ScrollSpy using IntersectionObserver for better reliability
const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px', // Focus on the middle of the viewport
    threshold: 0
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
            
            if (activeLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
document.querySelectorAll('section[id]').forEach(section => observer.observe(section));

// Manual fallback for the very top and very bottom
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY || window.pageYOffset;
    
    // At the very top, ensure Home is active
    if (scrollPos < 100) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLinks[0]) navLinks[0].classList.add('active');
    }
    
    // At the very bottom, ensure Progress is active
    if ((window.innerHeight + scrollPos) >= document.body.offsetHeight - 50) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLinks[navLinks.length - 1]) navLinks[navLinks.length - 1].classList.add('active');
    }
});

// Attraction Filters
const filterBtns = document.querySelectorAll('.tab-btn');
const attractionCards = document.querySelectorAll('.attraction-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        gsap.to(attractionCards, {
            opacity: 0, scale: 0.9, duration: 0.3, stagger: 0.05,
            onComplete: () => {
                attractionCards.forEach(card => {
                    card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? 'block' : 'none';
                });
                gsap.to(attractionCards, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05 });
            }
        });
    });
});

// Trivia Counter Animation
const counters = document.querySelectorAll('.fact-number');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    gsap.to(counter, {
        innerText: target,
        duration: 2.5,
        snap: { innerText: 1 },
        scrollTrigger: {
            trigger: counter,
            start: 'top 90%'
        }
    });
});

gsap.from('.conclusion-content', {
    opacity: 0, y: 50, duration: 1.5,
    scrollTrigger: { trigger: '#conclusion', start: 'top 70%' }
});

// Banner Animation
gsap.from('#yuva-sangam-banner .banner-wrapper', {
    scrollTrigger: {
        trigger: '#yuva-sangam-banner',
        start: 'top 85%',
    },
    scale: 0.95,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
});

// Footer Animation
gsap.from('#main-footer .footer-section', {
    scrollTrigger: {
        trigger: '#main-footer',
        start: 'top 90%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: 'power3.out'
});

gsap.from('#main-footer .footer-bottom', {
    scrollTrigger: {
        trigger: '#main-footer',
        start: 'top 95%',
    },
    opacity: 0,
    duration: 1,
    delay: 0.8,
    ease: 'power2.out'
});
