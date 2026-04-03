/**
 * Full Custom Template - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFAQ();
    initAboutIntro();
    initOptionalSections();
    initDeliverables();
    initClientLogos();
    initSmoothScroll();
});

/**
 * Initialize About Intro with formatted content
 */
function initAboutIntro() {
    const introContent = document.querySelector('.about-intro-content[data-content]');
    if (!introContent) return;

    const content = introContent.getAttribute('data-content');
    if (!content || content.startsWith('{{')) return;

    // Split by double newlines for paragraphs, single newlines for line breaks
    const lines = content.split('\n');
    let html = '';

    // First line is the heading
    if (lines[0]) {
        html += '<h2>' + lines[0] + '</h2>';
    }

    // Second line is the subheading
    if (lines[1]) {
        html += '<p class="about-intro-subtitle">' + lines[1] + '</p>';
    }

    // Remaining lines are paragraphs
    for (let i = 2; i < lines.length; i++) {
        if (lines[i].trim()) {
            html += '<p>' + lines[i] + '</p>';
        }
    }

    introContent.innerHTML = html;
}

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                // Close other items
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

/**
 * Handle Optional Sections
 * Removes sections and elements that have empty data-optional attributes
 */
function initOptionalSections() {
    // Remove elements with empty optional values
    const optionalElements = document.querySelectorAll('[data-optional]');

    optionalElements.forEach(el => {
        const value = el.getAttribute('data-optional');
        // Check if value is empty or still contains unreplaced placeholder
        if (!value || value === '' || (value.startsWith('{{') && value.endsWith('}}'))) {
            el.remove();
        }
    });

    // Handle show-pricing attribute
    const pricingElements = document.querySelectorAll('[data-show-pricing]');
    pricingElements.forEach(el => {
        const showPricing = el.getAttribute('data-show-pricing');
        if (showPricing !== 'yes') {
            el.remove();
        }
    });

    // Handle hide-if attribute (for contact form when booking URL exists)
    const hideIfElements = document.querySelectorAll('[data-hide-if]');
    hideIfElements.forEach(el => {
        const value = el.getAttribute('data-hide-if');
        // If value exists and is not empty and not a placeholder, hide the element
        if (value && value !== '' && !(value.startsWith('{{') && value.endsWith('}}'))) {
            el.remove();
        }
    });

    // Remove empty sections (sections with no visible content)
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const hasContent = section.querySelector('h2, h3, p, .service-card, .testimonial, .faq-item, .stat');
        if (!hasContent) {
            section.remove();
        }
    });

    // Clean up empty grids
    const grids = document.querySelectorAll('.testimonials-grid, .stats-grid, .services-grid');
    grids.forEach(grid => {
        if (grid.children.length === 0) {
            grid.closest('section')?.remove();
        }
    });

    // Clean up empty sidebar boxes
    const sidebarBoxes = document.querySelectorAll('.sidebar-box');
    sidebarBoxes.forEach(box => {
        const list = box.querySelector('ul, ol');
        if (list && list.children.length === 0) {
            box.remove();
        }
    });

    // Remove GA scripts if no tracking ID
    const gaScripts = document.querySelectorAll('.ga-script');
    gaScripts.forEach(script => {
        const value = script.getAttribute('data-optional');
        if (!value || value === '' || (value.startsWith('{{') && value.endsWith('}}'))) {
            script.remove();
        }
    });
}

/**
 * Initialize Deliverables Lists from data attribute
 */
function initDeliverables() {
    const deliverablesLists = document.querySelectorAll('.deliverables-list[data-items]');

    deliverablesLists.forEach(list => {
        const itemsData = list.getAttribute('data-items');
        if (!itemsData || itemsData.startsWith('{{')) return;

        const items = itemsData.split('|').map(item => item.trim()).filter(item => item);

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    });
}

/**
 * Initialize Client Logos from data attribute
 */
function initClientLogos() {
    const logosContainer = document.querySelector('[data-logos]');
    if (!logosContainer) return;

    const logosData = logosContainer.getAttribute('data-logos');
    if (!logosData || logosData.startsWith('{{')) return;

    const logos = logosData.split(',').map(url => url.trim()).filter(url => url);

    logos.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Client logo';
        img.loading = 'lazy';
        logosContainer.appendChild(img);
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Form submission handling (for contact form)
 */
document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }
    });
});

/**
 * Newsletter form handling
 */
document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
        }
    });
});
