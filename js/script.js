document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initCategorySwitching();
    initVideoModal();
    initTestimonialLoop();
});

/**
 * GSAP Animations for entry and scroll
 */
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry
    const tl = gsap.timeline();
    tl.from('header h1', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    })
    .from('header p', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.6');

    // Testimonial scroll reveal removed to prevent conflict with infinite horizontal scroll
}

/**
 * Handles switching between different video categories
 */
function initCategorySwitching() {
    const categories = document.querySelectorAll('.category');
    const videoSections = document.querySelectorAll('.videos');

    categories.forEach(category => {
        category.addEventListener('click', () => {
            const targetId = category.getAttribute('data-category');

            // Update active category button
            categories.forEach(c => c.classList.remove('active-category'));
            category.classList.add('active-category');

            // Switch visible video section with GSAP
            videoSections.forEach(section => {
                if (section.classList.contains('active')) {
                    gsap.to(section, {
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        onComplete: () => {
                            section.classList.remove('active');
                            const nextSection = document.getElementById(targetId);
                            nextSection.classList.add('active');
                            gsap.fromTo(nextSection, 
                                { opacity: 0, y: 20 },
                                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                            );
                        }
                    });
                }
            });
        });
    });

    // Default to first category
    if (categories.length > 0) {
        // Just set classes initially to avoid double animation on load
        categories[0].classList.add('active-category');
        document.getElementById(categories[0].getAttribute('data-category')).classList.add('active');
    }
}

/**
 * Manages the video popup modal
 */
function initVideoModal() {
    const popup = document.getElementById('popup');
    const iframe = document.getElementById('popupVideo');
    const videoCards = document.querySelectorAll('.video-card');
    const closeBtn = document.querySelector('.popup-close');

    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-video-url');
            iframe.src = `${url}?autoplay=1&modestbranding=1&rel=0`;
            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    const closePopup = () => {
        popup.classList.remove('active');
        iframe.src = '';
        document.body.style.overflow = 'auto'; // Restore scroll
    };

    closeBtn.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });

    // ESC key support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });
}

/**
 * Ensures the testimonial loop is smooth
 */
function initTestimonialLoop() {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;

    // Duplicate all cards once for a seamless loop
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
}
