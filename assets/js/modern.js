/**
 * USS — Modern layer JS: animated counters + before/after sliders.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Count-up animation for elements with [data-count]
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        const animateCount = (el) => {
            const target = parseFloat(el.getAttribute('data-count'));
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const duration = 1800;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);
                el.textContent = prefix + value.toLocaleString() + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(el => counterObserver.observe(el));
    }

    // Before/After comparison sliders (.m-ba)
    document.querySelectorAll('.m-ba').forEach(ba => {
        const after = ba.querySelector('.after');
        const handle = ba.querySelector('.ba-handle');
        if (!after || !handle) return;

        const setPos = (clientX) => {
            const rect = ba.getBoundingClientRect();
            let pct = ((clientX - rect.left) / rect.width) * 100;
            pct = Math.max(2, Math.min(98, pct));
            after.style.clipPath = `inset(0 0 0 ${pct}%)`;
            handle.style.left = pct + '%';
        };

        let dragging = false;
        ba.addEventListener('pointerdown', (e) => {
            dragging = true;
            ba.setPointerCapture(e.pointerId);
            setPos(e.clientX);
        });
        ba.addEventListener('pointermove', (e) => {
            if (dragging) setPos(e.clientX);
        });
        ['pointerup', 'pointercancel'].forEach(ev =>
            ba.addEventListener(ev, () => { dragging = false; }));
        ba.style.cursor = 'ew-resize';
        ba.style.touchAction = 'pan-y';
    });
});
