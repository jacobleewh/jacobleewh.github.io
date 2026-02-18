// Twinkling Stars
function spawnStar() {
    const star = document.createElement('div');
    star.classList.add('shooting-star');

    // Random position across entire screen
    star.style.left = (Math.random() * window.innerWidth) + 'px';
    star.style.top  = (Math.random() * window.innerHeight) + 'px';

    // Random size between 2px and 5px
    const size = 2 + Math.random() * 3;
    star.style.width  = size + 'px';
    star.style.height = size + 'px';

    // Randomly accent green or white
    const green = Math.random() > 0.5;
    star.style.background = green ? '#00FFA3' : '#ffffff';
    star.style.boxShadow = green
        ? `0 0 ${size * 2}px ${size}px rgba(0,255,163,0.6)`
        : `0 0 ${size * 2}px ${size}px rgba(255,255,255,0.4)`;

    const duration = 0.8 + Math.random() * 1.4;
    star.style.animationDuration = duration + 's';

    document.body.appendChild(star);
    setTimeout(() => star.remove(), (duration + 0.1) * 1000);

    // Schedule next star
    setTimeout(spawnStar, 300 + Math.random() * 700);
}
setTimeout(spawnStar, 600);

// Project Modals
document.querySelectorAll('.btn-view-details[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.modal);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
    });
    overlay.querySelector('.modal-close').addEventListener('click', () => closeModal(overlay));
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
    }
});

// Page Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('pageLoader').classList.add('hidden');
    }, 800);
});

// Custom cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    }, 100);
});

// Hover effect on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// Scroll reveal animation
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    const windowHeight = window.innerHeight;
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Skill bar animation on scroll
const skillBars = document.querySelectorAll('.skill-progress');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.style.width;
            entry.target.style.width = '0%';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 100);
        }
    });
}, observerOptions);

skillBars.forEach(bar => observer.observe(bar));

// Navbar fade in/out on scroll direction
const navbar = document.querySelector('nav');
let lastScrollY = window.scrollY;
const navRevealOffset = 120;

function updateNavbarVisibility() {
    if (!navbar) return;

    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const nearTop = currentScrollY < navRevealOffset;

    if (nearTop || !scrollingDown) {
        navbar.classList.remove('nav-hidden');
        navbar.classList.add('nav-visible');
    } else {
        navbar.classList.add('nav-hidden');
        navbar.classList.remove('nav-visible');
    }

    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', updateNavbarVisibility, { passive: true });
updateNavbarVisibility();

// Navbar active link tracking by current section
const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = Array.from(navSectionLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

function setActiveNavLink(sectionId) {
    navSectionLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', isActive);
    });
}

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.3;
    let activeSectionId = sections[0]?.id;

    sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
            activeSectionId = section.id;
        }
    });

    if (activeSectionId) {
        setActiveNavLink(activeSectionId);
    }
}

navSectionLinks.forEach((link) => {
    link.addEventListener('click', () => {
        const targetId = link.getAttribute('href').slice(1);
        setActiveNavLink(targetId);
    });
});

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink();

// Stack items scroll-reveal with stagger per row
const stackItems = document.querySelectorAll('.stack-item');

const stackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const row = entry.target.closest('.stack-row');
            const siblings = row ? Array.from(row.querySelectorAll('.stack-item')) : [entry.target];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.animationDelay = (idx * 0.08) + 's';
            entry.target.classList.add('visible');
            stackObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

stackItems.forEach(item => stackObserver.observe(item));

// Hero typing effect: alternates two phrases continuously
const heroTyped = document.querySelector('.hero-typed');

if (heroTyped) {
    const phrases = [
        'Aspiring Full Stack Developer.',
        'Business and Fintech Student.',
        'AI Enthusiast.'
       
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeHeroLabel() {
        const currentPhrase = phrases[phraseIndex];

        if (!deleting) {
            charIndex += 1;
            heroTyped.textContent = currentPhrase.slice(0, charIndex);

            if (charIndex === currentPhrase.length) {
                deleting = true;
                setTimeout(typeHeroLabel, 1400);
                return;
            }
        } else {
            charIndex -= 1;
            heroTyped.textContent = currentPhrase.slice(0, charIndex);

            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        const delay = deleting ? 35 : 60;
        setTimeout(typeHeroLabel, delay);
    }

    typeHeroLabel();
}
