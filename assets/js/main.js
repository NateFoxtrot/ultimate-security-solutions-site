/**
 * Ultimate Security Solutions - Main JS
 * Global animations, navigation and interactive logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Scroll Effect
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links-wrapper');
    if (mobileToggle && navLinks) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'nav-mobile-overlay';
        document.body.appendChild(overlay);

        function closeMobileNav() {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('active');
            if (isOpen) {
                closeMobileNav();
            } else {
                mobileToggle.classList.add('active');
                navLinks.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        overlay.addEventListener('click', closeMobileNav);

        // Close on nav link click (mobile)
        navLinks.querySelectorAll('a:not(.dropdown-trigger)').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileNav();
        });
    }

    // Intersection Observer for animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-in').forEach(el => {
        animationObserver.observe(el);
    });
    // Expose globally for dynamically added elements
    window.animationObserver = animationObserver;

    // Dropdown Handling for Mobile (toggle open/close)
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
            // Keyboard accessibility: Enter/Space to toggle
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // Trace Animation Trigger Logic (if present)
    const jobButtons = document.querySelectorAll('.job-type-btn');
    jobButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const traceId = btn.getAttribute('data-trace');
            const trace = document.getElementById(`trace-${traceId}`);
            if (trace) trace.classList.add('active');
        });
        btn.addEventListener('mouseleave', () => {
            const traceId = btn.getAttribute('data-trace');
            const trace = document.getElementById(`trace-${traceId}`);
            if (trace) trace.classList.remove('active');
        });
    });

    // Hero Slider (if present)
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 7000);
    }
});
