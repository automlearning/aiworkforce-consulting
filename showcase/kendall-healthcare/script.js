/**
 * Kendell Health Care - JavaScript
 * Handles all interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initChatbot();
    initScrollEffects();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

/**
 * Smooth Scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                message: formData.get('message')
            };

            // Validate form
            if (!validateForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual endpoint)
                await simulateFormSubmission(data);

                // Show success message
                form.style.display = 'none';
                formSuccess.style.display = 'block';

                // Send email notification (in production, this would be handled server-side)
                console.log('Form submitted successfully:', data);

            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error sending your message. Please try again or contact us directly at 0431 738 834.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

/**
 * Form Validation
 */
function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name || data.name.trim().length < 2) {
        showFormError('Please enter your full name.');
        return false;
    }

    if (!data.email || !emailRegex.test(data.email)) {
        showFormError('Please enter a valid email address.');
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showFormError('Please enter a message (at least 10 characters).');
        return false;
    }

    return true;
}

/**
 * Show form error message
 */
function showFormError(message) {
    // Remove existing error
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }

    // Create and show new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = 'background-color: #FEE2E2; color: #DC2626; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9375rem;';
    errorDiv.textContent = message;

    const form = document.getElementById('contact-form');
    form.insertBefore(errorDiv, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Simulate form submission (for demo purposes)
 */
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1500);
    });
}

/**
 * Chatbot Functionality
 */
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotBadge = document.querySelector('.chatbot-badge');

    if (!chatbotToggle || !chatbotContainer) return;

    // Toggle chatbot
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotBadge.style.display = 'none';
            chatbotInput.focus();
        }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });

    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Remove quick replies after first interaction
        const quickReplies = document.querySelector('.chat-quick-replies');
        if (quickReplies) {
            quickReplies.remove();
        }

        // Generate bot response
        setTimeout(() => {
            const response = generateBotResponse(message);
            addMessage(response, 'bot');
        }, 800);
    }

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Quick replies
    document.querySelectorAll('.quick-reply').forEach(btn => {
        btn.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            chatbotInput.value = message;
            sendMessage();
        });
    });

    /**
     * Add message to chat
     */
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    /**
     * Generate bot response based on user input
     */
    function generateBotResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Service-related queries
        if (lowerMessage.includes('service') || lowerMessage.includes('what do you offer') || lowerMessage.includes('help')) {
            return "We offer a comprehensive range of healthcare services including:<br><br>" +
                   "• <strong>Nursing Services</strong> - Professional care from registered nurses<br>" +
                   "• <strong>In-Home Support</strong> - Assistance with daily activities<br>" +
                   "• <strong>Post Hospital Support</strong> - Recovery assistance<br>" +
                   "• <strong>Independent Living Support</strong><br>" +
                   "• <strong>Therapeutic Support</strong><br>" +
                   "• <strong>Community Access</strong><br><br>" +
                   "Would you like more details about any specific service?";
        }

        // NDIS queries
        if (lowerMessage.includes('ndis')) {
            return "Yes, Kendell Health Care is a registered NDIS provider! We support NDIS participants with various services aligned to their plans.<br><br>" +
                   "We can help with:<br>" +
                   "• Plan management<br>" +
                   "• Core supports<br>" +
                   "• Capacity building<br><br>" +
                   "Would you like to speak with our NDIS coordinator? Call us at <a href='tel:0431738834'>0431 738 834</a>.";
        }

        // Contact/speak to someone
        if (lowerMessage.includes('contact') || lowerMessage.includes('speak') || lowerMessage.includes('call') || lowerMessage.includes('phone')) {
            return "You can reach us through:<br><br>" +
                   "📞 <strong>Phone:</strong> <a href='tel:0431738834'>0431 738 834</a> or <a href='tel:0469233674'>0469 233 674</a><br>" +
                   "📧 <strong>Email:</strong> <a href='mailto:kendellhealthcare@gmail.com'>kendellhealthcare@gmail.com</a><br>" +
                   "📍 <strong>Address:</strong> 44 Burnbank Parade, Clyde North 3978<br><br>" +
                   "Or fill out the contact form below and we'll get back to you within 24 hours!";
        }

        // Pricing
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('how much')) {
            return "Our pricing varies depending on the services required and your individual needs. Many of our services are covered under NDIS plans.<br><br>" +
                   "For a personalized quote, please contact us at <a href='tel:0431738834'>0431 738 834</a> or send us a message through the contact form.";
        }

        // Location/area
        if (lowerMessage.includes('location') || lowerMessage.includes('area') || lowerMessage.includes('where') || lowerMessage.includes('melbourne')) {
            return "We're based in Clyde North, Melbourne and provide services across the greater Melbourne area.<br><br>" +
                   "📍 Our office is located at:<br>44 Burnbank Parade, Clyde North 3978<br><br>" +
                   "We offer in-home services and can discuss coverage areas for your specific needs.";
        }

        // Hours
        if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('available')) {
            return "Our office hours are Monday to Friday, 8:30 AM to 5:00 PM.<br><br>" +
                   "However, our care services are available 24/7 depending on your care plan requirements.<br><br>" +
                   "For urgent inquiries, please call <a href='tel:0431738834'>0431 738 834</a>.";
        }

        // Greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon')) {
            return "Hello! Welcome to Kendell Health Care. I'm here to help answer your questions about our healthcare services.<br><br>" +
                   "What would you like to know about?";
        }

        // Thanks
        if (lowerMessage.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with today?<br><br>" +
                   "Feel free to contact us directly at <a href='tel:0431738834'>0431 738 834</a> if you need further assistance.";
        }

        // Default response
        return "Thank you for your message. For more specific information, I recommend:<br><br>" +
               "• Calling us at <a href='tel:0431738834'>0431 738 834</a><br>" +
               "• Emailing <a href='mailto:kendellhealthcare@gmail.com'>kendellhealthcare@gmail.com</a><br>" +
               "• Filling out the contact form below<br><br>" +
               "Our team would be happy to discuss your healthcare needs in detail.";
    }
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');

    // Add shadow to navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
    });

    // Intersection Observer for fade-in animations
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

    // Apply to service cards and other elements
    document.querySelectorAll('.service-card, .mission-card, .about-content, .about-image').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}
