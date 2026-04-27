document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initAnimations();
    initCategorySwitching();
    initVideoModal();
    initTestimonialLoop();
});

/**
 * Custom Cursor Logic
 */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0
        });
        gsap.to(follower, {
            x: e.clientX - 16,
            y: e.clientY - 16,
            duration: 0.3
        });
    });

    // Hover effects
    const interactiveElements = document.querySelectorAll('button, .video-card, a, .category');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            gsap.to(follower, {
                scale: 1.5,
                backgroundColor: 'rgba(255, 180, 0, 0.1)',
                duration: 0.3
            });
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                duration: 0.3
            });
        });
    });
}

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
    }, '-=0.6')
    .from('.category', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.4');

    // Scroll reveal for testimonials
    gsap.from('.testimonial-card', {
        scrollTrigger: {
            trigger: '.testimonials-section',
            start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });
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

    // Duplicate testimonials for seamless looping if there are few
    const cards = Array.from(track.children);
    if (cards.length < 10) {
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
    }
}
