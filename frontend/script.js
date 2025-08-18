// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Remove scroll-based navigation for multi-page setup
    // Keep mobile navigation and modal functionality
    
    // Update active navigation based on current page
    function updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // Toggle aria-expanded on mobile
    if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
        });
    }

    // Retirer tentative de parallax sur pseudo-éléments (inefficace)
    // (suppression du bloc décoratif précédent)

    // Call on page load
    updateActiveNavLink();

    // Spectacle cards hover effects
    const spectacleCardsHover = document.querySelectorAll('.spectacle-card');
    spectacleCardsHover.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--color-accent)';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                // Here you would typically send the form data to your backend
                alert('Message envoyé avec succès!');
                this.reset();
            } else {
                alert('Veuillez remplir tous les champs.');
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Artistic text animations for hero
    const heroWords = document.querySelectorAll('.hero-title span');
    heroWords.forEach((word, index) => {
        word.style.animationDelay = `${index * 0.3}s`;
        word.style.animation = 'fadeInUp 0.8s ease forwards';
    });

    // Spectacle data
    const spectacleData = {
        souffle: {
            title: "SOUFFLE",
            description: "SOUFFLE est une proposition de Concert théâtral mêlant musique, théâtre et arts visuels.",
            images: [
                "public/sp1_souffle/Photo page perso SOUFFLE.jpg",
                "public/sp1_souffle/SOUFFLE DEVANTURE.jpg"
            ],
            video: "public/sp1_souffle/SOUFFLE DIAPORAMA.mp4",
            files: [
                { name: "Dossier SOUFFLE 2025", url: "public/sp1_souffle/SOUFFLE dossier 2025.pdf" }
            ]
        },
        clochettes: {
            title: "Les Clochettes dans les pieds",
            description: "Spectacle musical et sensoriel pour petits et grands.",
            images: ["public/sp2_clochettes/clochettes_main.jpg"],
            video: null,
            files: []
        },
        // Add other spectacles as needed
    };

    // Spectacle modal functionality
    const modal = document.getElementById('spectacle-modal');
    const modalClose = document.querySelector('.modal-close');
    const spectacleCardsWithData = document.querySelectorAll('.spectacle-card[data-spectacle]');

    // Define closeModal function in the global scope of this event listener
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Pause any playing video
        const video = modal.querySelector('video');
        if (video) {
            video.pause();
        }
    }

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    function openSpectacleModal(spectacle) {
        const modalTitle = document.querySelector('.modal-title');
        const modalDescription = document.querySelector('.modal-description');
        const mainImage = document.querySelector('.main-image');
        const thumbnails = document.querySelector('.gallery-thumbnails');
        const videoContainer = document.querySelector('.modal-video');
        const filesContainer = document.querySelector('.modal-files');

        // Set title and description
        if (modalTitle) modalTitle.textContent = spectacle.title;
        if (modalDescription) modalDescription.innerHTML = `<p>${spectacle.description}</p>`;

        // Set main image
        if (mainImage && spectacle.images && spectacle.images.length > 0) {
            mainImage.src = spectacle.images[0];
            mainImage.alt = spectacle.title;
        }

        // Set thumbnails
        if (thumbnails) {
            thumbnails.innerHTML = '';
            if (spectacle.images && spectacle.images.length > 1) {
                spectacle.images.forEach((img, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = img;
                    thumb.alt = `${spectacle.title} ${index + 1}`;
                    thumb.addEventListener('click', function() {
                        mainImage.src = this.src;
                        thumbnails.querySelectorAll('img').forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                    });
                    if (index === 0) thumb.classList.add('active');
                    thumbnails.appendChild(thumb);
                });
            }
        }

        // Set video
        if (videoContainer) {
            videoContainer.innerHTML = '';
            if (spectacle.video) {
                const video = document.createElement('video');
                video.src = spectacle.video;
                video.controls = true;
                video.preload = 'metadata';
                videoContainer.appendChild(video);
            }
        }

        // Set files
        if (filesContainer) {
            filesContainer.innerHTML = '';
            if (spectacle.files && spectacle.files.length > 0) {
                spectacle.files.forEach(file => {
                    const link = document.createElement('a');
                    link.href = file.url;
                    link.textContent = file.name;
                    link.className = 'file-link';
                    link.target = '_blank';
                    filesContainer.appendChild(link);
                });
            }
        }

        // Show modal
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // Enhanced image loading handlers
    const images = document.querySelectorAll('.card-image img');
    images.forEach(img => {
        // Check if image is already loaded
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
                console.log('Image loaded successfully:', this.src);
            });
            
            img.addEventListener('error', function() {
                console.log('Image failed to load:', this.src);
                this.style.display = 'none';
                const placeholder = this.nextElementSibling;
                if (placeholder && placeholder.classList.contains('image-placeholder')) {
                    placeholder.style.display = 'flex';
                }
            });
        }
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Enhanced parallax for background images
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        
        if (heroBg) {
            const rate = scrolled * 0.3;
            heroBg.style.transform = `translateY(${rate}px)`;
        }
    });

    // Utility function for smooth reveal animations
    function revealOnScroll() {
        // Don't apply reveal animation to spectacle cards on spectacles page
        const isSpectaclesPage = window.location.pathname.includes('spectacles.html');
        const selector = isSpectaclesPage ? 
            '.ensemble-item, .category' : 
            '.spectacle-card, .ensemble-item, .category';
            
        const reveals = document.querySelectorAll(selector);
        
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('revealed');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);

    // Add CSS class for revealed elements - exclude spectacle cards on spectacles page
    const style = document.createElement('style');
    style.textContent = `
        .ensemble-item,
        .category {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        /* Only hide spectacle cards on non-spectacles pages */
        body:not([data-page="spectacles"]) .spectacle-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .spectacle-card.revealed,
        .ensemble-item.revealed,
        .category.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Keyboard navigation for modal - moved inside DOMContentLoaded
    document.addEventListener('keydown', function(e) {
        if (modal && modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            }
        }
    });

    // Spectacle navigation - add click handlers for spectacle cards
    const spectacleCards = document.querySelectorAll('.spectacle-card[data-spectacle]');
    spectacleCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const spectacleId = this.dataset.spectacle;
            
            // Check if we have a dedicated page for this spectacle
            const spectaclePages = {
                'clochettes': 'clochettes.html',
                'souffle': 'souffle.html',
                'indika': 'indika.html',
                'faubourgdesmers': 'faubourgdesmers.html',
                'fabriquehistoire': 'fabriquehistoire.html',
                'queterale': 'queterale.html',
                // Add other spectacle pages here as they are created
                // etc.
            };
            
            if (spectaclePages[spectacleId]) {
                // Navigate to dedicated page
                window.location.href = spectaclePages[spectacleId];
            }
            // Supprimez la partie else qui ouvre le modal
        });
    });

    // Amélioration focus clavier sur cartes (Enter déclenche)
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.classList.contains('spectacle-card') && e.target.dataset.spectacle) {
            e.target.click();
        }
    });

    // Intersection Observer for reveal animations
    document.addEventListener('DOMContentLoaded', () => {
        if ('IntersectionObserver' in window) {
            document.body.classList.add('js-reveal-enabled');
            const io = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('revealed');
                        io.unobserve(e.target);
                    }
                });
            }, { threshold: 0.15 });
            document.querySelectorAll('.artist-card').forEach(el => io.observe(el));
        }
    });
});