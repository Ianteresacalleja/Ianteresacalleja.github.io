// Simple JavaScript lazy loader for images with class 'lazy-img'
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const lazyImages = [].slice.call(document.querySelectorAll('img.lazy-img'));
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.remove('lazy-img');
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback: just load all images
        const lazyImages = document.querySelectorAll('img.lazy-img');
        lazyImages.forEach(function(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.classList.remove('lazy-img');
        });
    }
});
// Main JavaScript entry point
// Add your interactive behavior here.

// Contact Modal Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactTrigger = document.getElementById('contact-trigger');
    const contactModal = document.getElementById('contact-modal');
    const closeBtn = document.querySelector('.contact-modal-close');
    const contactForm = document.getElementById('contact-form');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setupReveal(elements, staggerMs) {
        const validElements = Array.from(elements || []).filter(Boolean);
        if (validElements.length === 0) {
            return;
        }

        if (reduceMotion || !('IntersectionObserver' in window)) {
            validElements.forEach(function(element) {
                element.classList.add('is-revealed');
            });
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

        validElements.forEach(function(element, index) {
            element.classList.add('reveal-on-scroll');
            element.style.setProperty('--reveal-delay', (index % 10) * staggerMs + 'ms');
            observer.observe(element);
        });
    }

    setupReveal(document.querySelectorAll('.project-card'), 20);
    setupReveal(document.querySelectorAll('.about-content, .photo-hero, .photo-controls'), 28);

    document.body.classList.add('page-ready');

    const pageLinks = document.querySelectorAll('a[href]');
    pageLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const rawHref = link.getAttribute('href') || '';
            if (!rawHref || rawHref.charAt(0) === '#' || rawHref.indexOf('javascript:') === 0) {
                return;
            }

            if (link.getAttribute('target') === '_blank' || link.hasAttribute('download')) {
                return;
            }

            if (rawHref.indexOf('mailto:') === 0 || rawHref.indexOf('tel:') === 0) {
                return;
            }

            const destination = new URL(rawHref, window.location.href);
            if (destination.origin !== window.location.origin) {
                return;
            }

            if (destination.href === window.location.href) {
                return;
            }

            e.preventDefault();

            if (reduceMotion) {
                window.location.href = destination.href;
                return;
            }

            document.body.classList.add('is-page-leaving');
            window.setTimeout(function() {
                window.location.href = destination.href;
            }, 280);
        });
    });

    const navbar = document.querySelector('.navbar');
    const navbarContainer = navbar ? navbar.querySelector('.container') : null;
    const mainMenu = navbar ? navbar.querySelector('.main-menu') : null;
    let navToggle = null;

    if (mainMenu) {
        const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        const navLinks = mainMenu.querySelectorAll('a[href]');

        navLinks.forEach(function(link) {
            const href = (link.getAttribute('href') || '').toLowerCase();
            const isHome = currentPath === 'index.html' || currentPath === '';
            const isCurrent =
                (isHome && href === 'index.html') ||
                (currentPath === 'photo.html' && href === 'photo.html') ||
                (currentPath === 'resume.html' && href === 'resume.html') ||
                (currentPath.indexOf('project') === 0 && href === 'index.html');

            link.classList.toggle('is-current', isCurrent);
        });
    }

    if (navbarContainer && mainMenu) {
        navToggle = document.createElement('button');
        navToggle.type = 'button';
        navToggle.className = 'nav-toggle';
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<span class="nav-toggle-line"></span><span class="nav-toggle-line"></span><span class="nav-toggle-line"></span>';
        navbarContainer.appendChild(navToggle);

        function closeMobileMenu() {
            mainMenu.classList.remove('is-open');
            navToggle.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }

        navToggle.addEventListener('click', function() {
            const shouldOpen = !mainMenu.classList.contains('is-open');
            mainMenu.classList.toggle('is-open', shouldOpen);
            navToggle.classList.toggle('is-open', shouldOpen);
            navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        });

        const navLinks = mainMenu.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });
    }

    if (contactModal) {
        contactModal.setAttribute('aria-hidden', 'true');
    }

    let lastFocusedElement = null;

    function getModalFocusableElements() {
        if (!contactModal) {
            return [];
        }

        return Array.from(contactModal.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    }

    function openContactModal() {
        if (!contactModal) {
            return;
        }

        lastFocusedElement = document.activeElement;
        contactModal.classList.add('active');
        contactModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const focusables = getModalFocusableElements();
        if (focusables[0]) {
            focusables[0].focus();
        }
    }

    function closeContactModal() {
        if (!contactModal) {
            return;
        }

        contactModal.classList.remove('active');
        contactModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    // Open modal when contact link is clicked
    if (contactTrigger) {
        contactTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            openContactModal();
        });
    }

    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', closeContactModal);
    }

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === contactModal) {
            closeContactModal();
        }
    });

    // Trap keyboard focus inside the modal and allow ESC to close it.
    document.addEventListener('keydown', function(e) {
        if (!contactModal || !contactModal.classList.contains('active')) {
            return;
        }

        if (e.key === 'Escape') {
            closeContactModal();
            return;
        }

        if (e.key !== 'Tab') {
            return;
        }

        const focusables = getModalFocusableElements();
        if (focusables.length === 0) {
            e.preventDefault();
            return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const isShiftTab = e.shiftKey;

        if (isShiftTab && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!isShiftTab && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Form will submit to Formspree via the action attribute
            // Just ensure proper handling if needed
        });
    }

    // About link behavior: scroll locally when available, otherwise go to home about section.
    const aboutNavLinks = document.querySelectorAll('.main-menu a[href="#about-section"], .main-menu a[href="index.html#about-section"]');
    aboutNavLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const localAboutSection = document.getElementById('about-section');
            if (localAboutSection) {
                e.preventDefault();
                localAboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', '#about-section');
                }
                return;
            }

            if (link.getAttribute('href') === '#about-section') {
                e.preventDefault();
                window.location.href = 'index.html#about-section';
            }
        });
    });

    // Project gallery thumbnail behavior
    const galleries = document.querySelectorAll('.project-gallery');
    galleries.forEach(function(gallery) {
        const mainImage = gallery.querySelector('.project-main-image');
        const thumbs = gallery.querySelectorAll('.project-thumb');

        if (!mainImage || thumbs.length === 0) {
            return;
        }

        thumbs.forEach(function(thumb) {
            thumb.addEventListener('click', function() {
                const fullSrc = thumb.getAttribute('data-full');
                const thumbImg = thumb.querySelector('img');
                if (!fullSrc) {
                    return;
                }

                mainImage.src = fullSrc;
                if (thumbImg && thumbImg.alt) {
                    mainImage.alt = thumbImg.alt.replace('thumbnail', 'main image');
                }

                thumbs.forEach(function(item) {
                    item.classList.remove('is-active');
                });
                thumb.classList.add('is-active');
            });
        });
    });

    // Project main image zoom/lightbox behavior
    const projectMainImages = document.querySelectorAll('.project-page .project-main-image');
    if (projectMainImages.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'project-image-lightbox';
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.innerHTML = '<button type="button" class="project-image-lightbox-close" aria-label="Close zoomed image">&times;</button><img class="project-image-lightbox-img" alt="Zoomed project image">';
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector('.project-image-lightbox-img');
        const closeLightboxBtn = lightbox.querySelector('.project-image-lightbox-close');

        function openLightbox(src, alt) {
            lightboxImage.src = src;
            lightboxImage.alt = alt || 'Zoomed project image';
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        projectMainImages.forEach(function(image) {
            image.setAttribute('tabindex', '0');

            image.addEventListener('click', function() {
                openLightbox(image.src, image.alt);
            });

            image.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(image.src, image.alt);
                }
            });
        });

        closeLightboxBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // About section business card flip
    const businessCards = document.querySelectorAll('.business-card');
    businessCards.forEach(function(card) {
        card.addEventListener('click', function() {
            card.classList.toggle('is-flipped');
        });
    });

    // Download business card front/back as a single PDF
    const businessCardDownload = document.getElementById('business-card-download');
    if (businessCardDownload) {
        businessCardDownload.addEventListener('click', async function() {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                return;
            }

            const frontSrc = businessCardDownload.getAttribute('data-front');
            const backSrc = businessCardDownload.getAttribute('data-back');
            if (!frontSrc || !backSrc) {
                return;
            }

            const originalLabel = businessCardDownload.textContent;
            businessCardDownload.textContent = 'Preparing PDF...';
            businessCardDownload.disabled = true;

            const loadImage = function(src) {
                return new Promise(function(resolve, reject) {
                    const image = new Image();
                    image.onload = function() {
                        resolve(image);
                    };
                    image.onerror = reject;
                    image.src = src;
                });
            };

            try {
                const images = await Promise.all([loadImage(frontSrc), loadImage(backSrc)]);
                const frontImage = images[0];
                const backImage = images[1];

                const pageWidth = Math.max(frontImage.width, backImage.width);
                const frontHeightScaled = (frontImage.height * pageWidth) / frontImage.width;
                const backHeightScaled = (backImage.height * pageWidth) / backImage.width;
                const pageHeight = frontHeightScaled + backHeightScaled;

                const pdf = new window.jspdf.jsPDF({
                    unit: 'pt',
                    format: [pageWidth, pageHeight]
                });

                // Edge-to-edge layout: no margins and no gap between front and back.
                pdf.addImage(frontImage, 'PNG', 0, 0, pageWidth, frontHeightScaled);
                pdf.addImage(backImage, 'PNG', 0, frontHeightScaled, pageWidth, backHeightScaled);
                pdf.save('ian-teresa-calleja-business-card.pdf');
            } catch (error) {
                // Silently ignore failed downloads to avoid interrupting browsing.
            } finally {
                businessCardDownload.textContent = originalLabel;
                businessCardDownload.disabled = false;
            }
        });
    }

    // Photography page gallery behavior
    const photoGalleryGrid = document.getElementById('photo-gallery-grid');
    if (photoGalleryGrid) {
        const photoItems = [
            { src: 'images/Photography/B:W analog photo/architecture/img20260329_19030402.png', category: 'architecture', label: 'Architecture', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/architecture/img20260329_19010840.png', category: 'architecture', label: 'Architecture', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/architecture/img20260329_19014148.png', category: 'architecture', label: 'Architecture', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/architecture/img20260329_19002821.png', category: 'architecture', label: 'Architecture', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/architecture/img20260329_19373076.png', category: 'architecture', label: 'Architecture', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/architecture/img20260329_19494351.png', category: 'architecture', label: 'Architecture', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/architecture/img20260329_19511755.png', category: 'architecture', label: 'Architecture', medium: 'analog' },

            { src: 'images/Photography/B:W analog photo/msc/img20260329_18352436.png', category: 'msc', label: 'MSC', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/msc/img20260329_18362899.png', category: 'msc', label: 'MSC', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/msc/img20260329_18382364.png', category: 'msc', label: 'MSC', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/msc/img20260329_18344352.png', category: 'msc', label: 'MSC', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/msc/img20260329_18443908.png', category: 'msc', label: 'MSC', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/msc/img20260329_18435866.png', category: 'msc', label: 'MSC', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/msc/img20260329_18372618.png', category: 'msc', label: 'MSC', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/msc/img20260329_19022175.png', category: 'msc', label: 'MSC', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/msc/img20260329_18375525.png', category: 'msc', label: 'MSC', medium: 'analog' },

            { src: 'images/Photography/B:W analog photo/photograms/img20260329_19043290.png', category: 'photograms', label: 'Photograms', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/photograms/img20260329_19034283.png', category: 'photograms', label: 'Photograms', medium: 'analog' },
            { src: 'images/Photography/B:W analog photo/photograms/img20260329_19040495.png', category: 'photograms', label: 'Photograms', medium: 'analog' },

            { src: 'images/Photography/digital photo/car photos/DSCF8613.JPEG', category: 'car', label: 'Car', medium: 'digital' },
            { src: 'images/Photography/digital photo/car photos/DSCF8629.JPEG', category: 'car', label: 'Car', medium: 'digital' },
            { src: 'images/Photography/digital photo/car photos/DSCF8612.JPEG', category: 'car', label: 'Car', medium: 'digital' },
            { src: 'images/Photography/digital photo/car photos/DSCF8632.JPEG', category: 'car', label: 'Car', medium: 'digital' },
            { src: 'images/Photography/digital photo/car photos/DSCF8615.JPEG', category: 'car', label: 'Car', medium: 'digital' },
            { src: 'images/Photography/digital photo/car photos/DSCF8618.JPEG', category: 'car', label: 'Car', medium: 'digital' },
            { src: 'images/Photography/digital photo/car photos/DSCF8637.JPEG', category: 'car', label: 'Car', medium: 'digital' },

            { src: 'images/Photography/digital photo/garden photos/_DSF6865.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF7011.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF7005.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6888.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF7015.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6874.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6998.jpg', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6965.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6960.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6801.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF7062.jpg', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6792.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6774.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6832.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6834.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6771.jpg', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6764.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },
            { src: 'images/Photography/digital photo/garden photos/_DSF6933.JPG', category: 'garden', label: 'Garden', medium: 'digital', tone: 'bw' },

            { src: 'images/Photography/digital photo/park/d-walk -01.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -02.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -03.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -04.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -05.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -07.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -08.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -09.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -10.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -11.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -12.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -14.png', category: 'park', label: 'Park', medium: 'digital' },
            { src: 'images/Photography/digital photo/park/d-walk -15.png', category: 'park', label: 'Park', medium: 'digital' }
        ];

        const photoMarkup = photoItems.map(function(item, index) {
            const tone = item.tone || (item.medium === 'analog' ? 'bw' : 'color');
            const toneLabel = tone === 'bw' ? 'B/W' : 'Color';

            return '<figure class="photo-item" tabindex="0" data-category="' + item.category + '" data-medium="' + item.medium + '" data-tone="' + tone + '" data-index="' + index + '">' +
                '<img src="' + item.src + '" alt="' + item.label + ' photo ' + (index + 1) + '" loading="lazy">' +
                '<span class="photo-medium-tag">' + item.medium + '</span>' +
                '<span class="photo-tone-tag">' + toneLabel + '</span>' +
                '<figcaption>' + item.label + '</figcaption>' +
            '</figure>';
        }).join('');

        photoGalleryGrid.innerHTML = photoMarkup;

        const filters = document.querySelectorAll('.photo-filter');
        const availableFilters = Array.from(filters).map(function(filterButton) {
            return filterButton.getAttribute('data-filter') || 'all';
        });

        const initialUrlFilter = new URLSearchParams(window.location.search).get('filter');
        let activeFilter = availableFilters.indexOf(initialUrlFilter || '') !== -1 ? initialUrlFilter : 'all';
        let filterAnimationFrame = null;

        function syncFilterToUrl(filterValue) {
            if (!window.history || !window.history.replaceState) {
                return;
            }

            const currentUrl = new URL(window.location.href);
            if (filterValue === 'all') {
                currentUrl.searchParams.delete('filter');
            } else {
                currentUrl.searchParams.set('filter', filterValue);
            }

            const nextUrl = currentUrl.pathname + (currentUrl.search || '') + (currentUrl.hash || '');
            window.history.replaceState(null, '', nextUrl);
        }

        function applyFilter(filterValue) {
            const cards = photoGalleryGrid.querySelectorAll('.photo-item');
            const cardsToAnimate = [];

            cards.forEach(function(card, index) {
                const matchesCategory = card.getAttribute('data-category') === filterValue;
                const matchesMedium = card.getAttribute('data-medium') === filterValue;
                const matchesTone = card.getAttribute('data-tone') === filterValue;
                const matches = filterValue === 'all' || matchesCategory || matchesMedium || matchesTone;
                card.classList.toggle('is-hidden', !matches);

                if (matches && !reduceMotion) {
                    card.style.setProperty('--filter-delay', (index % 6) * 10 + 'ms');
                    card.classList.remove('is-filter-enter');
                    cardsToAnimate.push(card);
                }
            });

            if (!reduceMotion && cardsToAnimate.length > 0) {
                if (filterAnimationFrame) {
                    window.cancelAnimationFrame(filterAnimationFrame);
                }

                filterAnimationFrame = window.requestAnimationFrame(function() {
                    cardsToAnimate.forEach(function(card) {
                        card.classList.add('is-filter-enter');
                    });
                    filterAnimationFrame = null;
                });
            }
        }

        filters.forEach(function(filterButton) {
            filterButton.addEventListener('click', function() {
                activeFilter = filterButton.getAttribute('data-filter') || 'all';
                filters.forEach(function(button) {
                    button.classList.remove('is-active');
                });
                filterButton.classList.add('is-active');
                applyFilter(activeFilter);
                syncFilterToUrl(activeFilter);
            });
        });

        const lightbox = document.createElement('div');
        lightbox.className = 'photo-lightbox';
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.innerHTML = '<button type="button" class="photo-lightbox-close" aria-label="Close image">&times;</button><button type="button" class="photo-lightbox-prev" aria-label="Previous image">&#8249;</button><img class="photo-lightbox-img" alt="Expanded photo"><button type="button" class="photo-lightbox-next" aria-label="Next image">&#8250;</button>';
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector('.photo-lightbox-img');
        const closeLightboxBtn = lightbox.querySelector('.photo-lightbox-close');
        const prevLightboxBtn = lightbox.querySelector('.photo-lightbox-prev');
        const nextLightboxBtn = lightbox.querySelector('.photo-lightbox-next');

        let currentPhotoIndex = -1;
        let closePhotoTimer = null;
        const preloadedSources = new Set();

        function getVisibleIndexes() {
            const visibleCards = photoGalleryGrid.querySelectorAll('.photo-item:not(.is-hidden)');
            return Array.from(visibleCards).map(function(card) {
                return Number(card.getAttribute('data-index'));
            });
        }

        function openPhoto(index) {
            const item = photoItems[index];
            if (!item) {
                return;
            }

            if (closePhotoTimer) {
                window.clearTimeout(closePhotoTimer);
                closePhotoTimer = null;
            }

            currentPhotoIndex = index;
            lightbox.classList.remove('is-closing');
            lightboxImage.src = item.src;
            lightboxImage.alt = item.label + ' photo';
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            preloadAdjacent(index);
        }

        function closePhoto() {
            if (!lightbox.classList.contains('active')) {
                return;
            }

            if (reduceMotion) {
                lightbox.classList.remove('active');
                lightbox.classList.remove('is-closing');
                lightbox.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                currentPhotoIndex = -1;
                return;
            }

            lightbox.classList.add('is-closing');
            closePhotoTimer = window.setTimeout(function() {
                lightbox.classList.remove('active');
                lightbox.classList.remove('is-closing');
                lightbox.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                currentPhotoIndex = -1;
            }, 260);
        }

        function preloadImage(src) {
            if (!src || preloadedSources.has(src)) {
                return;
            }

            preloadedSources.add(src);
            const image = new Image();
            image.src = src;
        }

        function preloadAdjacent(index) {
            const visibleIndexes = getVisibleIndexes();
            if (visibleIndexes.length < 2) {
                return;
            }

            const currentVisiblePos = visibleIndexes.indexOf(index);
            if (currentVisiblePos === -1) {
                return;
            }

            const prevPos = (currentVisiblePos - 1 + visibleIndexes.length) % visibleIndexes.length;
            const nextPos = (currentVisiblePos + 1) % visibleIndexes.length;
            const prevItem = photoItems[visibleIndexes[prevPos]];
            const nextItem = photoItems[visibleIndexes[nextPos]];
            preloadImage(prevItem && prevItem.src);
            preloadImage(nextItem && nextItem.src);
        }

        function movePhoto(step) {
            const visibleIndexes = getVisibleIndexes();
            if (visibleIndexes.length === 0 || currentPhotoIndex === -1) {
                return;
            }

            const currentVisiblePos = visibleIndexes.indexOf(currentPhotoIndex);
            if (currentVisiblePos === -1) {
                openPhoto(visibleIndexes[0]);
                return;
            }

            const nextPos = (currentVisiblePos + step + visibleIndexes.length) % visibleIndexes.length;
            openPhoto(visibleIndexes[nextPos]);
        }

        photoGalleryGrid.addEventListener('click', function(event) {
            const card = event.target.closest('.photo-item');
            if (!card || card.classList.contains('is-hidden')) {
                return;
            }

            const index = Number(card.getAttribute('data-index'));
            openPhoto(index);
        });

        photoGalleryGrid.addEventListener('keydown', function(event) {
            const card = event.target.closest('.photo-item');
            if (!card || card.classList.contains('is-hidden')) {
                return;
            }

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const index = Number(card.getAttribute('data-index'));
                openPhoto(index);
            }
        });

        closeLightboxBtn.addEventListener('click', closePhoto);
        prevLightboxBtn.addEventListener('click', function() {
            movePhoto(-1);
        });
        nextLightboxBtn.addEventListener('click', function() {
            movePhoto(1);
        });

        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) {
                closePhoto();
            }
        });

        document.addEventListener('keydown', function(event) {
            if (!lightbox.classList.contains('active')) {
                return;
            }

            if (event.key === 'Escape') {
                closePhoto();
            } else if (event.key === 'ArrowLeft') {
                movePhoto(-1);
            } else if (event.key === 'ArrowRight') {
                movePhoto(1);
            }
        });

        let touchStartX = 0;
        let touchDeltaX = 0;
        lightboxImage.addEventListener('touchstart', function(event) {
            if (!lightbox.classList.contains('active') || !event.touches[0]) {
                return;
            }

            touchStartX = event.touches[0].clientX;
            touchDeltaX = 0;
        }, { passive: true });

        lightboxImage.addEventListener('touchmove', function(event) {
            if (!event.touches[0]) {
                return;
            }

            touchDeltaX = event.touches[0].clientX - touchStartX;
        }, { passive: true });

        lightboxImage.addEventListener('touchend', function() {
            if (Math.abs(touchDeltaX) > 45) {
                movePhoto(touchDeltaX > 0 ? -1 : 1);
            }

            touchStartX = 0;
            touchDeltaX = 0;
        });

        filters.forEach(function(button) {
            const buttonFilter = button.getAttribute('data-filter') || 'all';
            button.classList.toggle('is-active', buttonFilter === activeFilter);
        });
        applyFilter(activeFilter);
        syncFilterToUrl(activeFilter);

        setupReveal(photoGalleryGrid.querySelectorAll('.photo-item'), 12);
    }
});
