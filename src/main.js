document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Smooth Scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Waitlist Form Handling
    const waitlistForm = document.getElementById('waitlist-form');
    const formMsg = document.getElementById('form-msg');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = waitlistForm.querySelector('input[type="email"]').value;

            // Simulate API call
            const btn = waitlistForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Joining...';
            btn.disabled = true;

            setTimeout(() => {
                console.log(`Email registered: ${email}`);
                waitlistForm.style.display = 'none';
                formMsg.style.display = 'block';

                // Track for "investors" - if they requested pitch deck
                if (window.location.hash === '#investors') {
                    formMsg.innerText = "Pitch deck request received! We'll be in touch. 📈";
                }
            }, 1500);
        });
    }

    // Waitlist Count Up Animation
    const animatedCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const count = +el.innerText.replace(',', '');
        const speed = 200; // Lower is faster
        const inc = target / speed;

        if (count < target) {
            el.innerText = Math.ceil(count + inc).toLocaleString();
            setTimeout(() => animatedCounter(el), 1);
        } else {
            el.innerText = target.toLocaleString();
        }
    };

    // Parallax and Counter Trigger
    const heroImage = document.querySelector('.hero-image img');
    const waitlistCount = document.getElementById('waitlist-count');
    let counterStarted = false;

    if (heroImage) {
        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    // Trigger counter when hero is revealed
    const heroReveal = document.querySelector('.hero-content');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterStarted && waitlistCount) {
                animatedCounter(waitlistCount);
                counterStarted = true;
            }
        });
    }, { threshold: 0.1 });

    if (heroReveal) observer.observe(heroReveal);
});
