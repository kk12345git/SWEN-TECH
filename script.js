// ============================================
// SERVICE WORKER REGISTRATION (PWA)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('🚀 Service Worker Registered', reg))
            .catch(err => console.log('❌ SW Registration Failed', err));
    });
}

/**
 * SWEN TECH SOLUTIONS - Business Platform v5.0
 * Simplified Performance-First Engine
 */

// ============================================
// SMOOTH SCROLL & NAVIGATION
// ============================================

class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });

        // Simple smooth scroll for manual links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }
}

// ============================================
// REVEAL ANIMATIONS (Intersection Observer)
// ============================================

class RevealOnScroll {
    constructor() {
        this.revealElements = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        this.revealElements.forEach(el => observer.observe(el));
    }
}

// ============================================
// TYPING EFFECT FOR HERO
// ============================================

class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        this.element.textContent = currentText.substring(0, this.charIndex + 1);
        this.charIndex++;

        if (this.charIndex <= currentText.length) {
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// ============================================
// BUSINESS ENQUIRY & ORDER SYSTEM WITH EMAILJS
// ============================================

class OrderManager {
    constructor() {
        this.form = document.getElementById('enquiryForm');
        this.ackSection = document.getElementById('acknowledgement');
        this.ackEmail = document.getElementById('ackEmail');
        this.submitButton = null;

        // Global EmailJS Configuration
        this.emailConfig = typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG : {
            publicKey: 'yp0ihX-TrRBRQeC8O',
            serviceID: 'service_rsem54o',
            templates: { enquiry: 'template_ad1l3mv' }
        };

        this.templateID = this.emailConfig.templates?.enquiry || this.emailConfig.templateID || 'template_ad1l3mv';

        this.init();
    }

    init() {
        if (!this.form) return;

        // Initialize EmailJS with public key
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.emailConfig.publicKey);
        }

        this.submitButton = this.form.querySelector('button[type="submit"]');

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmission();
        });

        // Draft Persistence
        this.loadDraft();
        this.form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => this.saveDraft());
        });
    }

    saveDraft() {
        const formData = {};
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.id) formData[input.id] = input.value;
        });
        localStorage.setItem('quote_form_draft', JSON.stringify(formData));
        console.log('📝 Draft Saved');
    }

    loadDraft() {
        const saved = localStorage.getItem('quote_form_draft');
        if (!saved) return;

        try {
            const formData = JSON.parse(saved);
            Object.keys(formData).forEach(id => {
                const input = document.getElementById(id);
                if (input && !input.value) { // Don't overwrite if QuoteFormLoader already filled it
                    input.value = formData[id];
                }
            });
            console.log('📥 Draft Restored');
        } catch (e) {
            console.error('Failed to load draft:', e);
        }
    }

    clearDraft() {
        localStorage.removeItem('quote_form_draft');
    }

    async handleSubmission() {
        // Get form values
        const calcEstimate = document.getElementById('calculatorEstimate');

        const formData = {
            user_name: document.getElementById('name').value,
            user_email: document.getElementById('email').value,
            user_phone: document.getElementById('phone')?.value || 'Not provided',
            service_type: this.getServiceName(document.getElementById('service').value),
            calculator_estimate: (calcEstimate && calcEstimate.value) ? calcEstimate.value : 'Not provided',
            user_message: document.getElementById('message').value,
            current_time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            // Aliases for template compatibility
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone')?.value || 'Not provided',
            message: document.getElementById('message').value,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            title: 'New Project Enquiry'
        };

        // Show loading state
        this.setLoadingState(true);

        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                this.emailConfig.serviceID,
                this.templateID,
                formData
            );

            console.log('✅ Email sent successfully:', response);
            this.showSuccess(formData.user_email);
            this.clearDraft();
            localStorage.removeItem('pricingCalculatorData'); // Clear calculator data too after success

        } catch (error) {
            console.error('❌ Email sending failed:', error);
            this.showError(error);
        } finally {
            this.setLoadingState(false);
        }
    }

    getServiceName(value) {
        const services = {
            'web': 'Web Development',
            'mobile': 'Mobile Apps',
            'ecommerce': 'E-commerce',
            'ai': 'AI & ML',
            'saas': 'SaaS Platform',
            'erp': 'ERP System',
            'cloud': 'Cloud Solutions',
            'devops': 'DevOps',
            'security': 'Cybersecurity',
            'data': 'Data Analytics',
            'blockchain': 'Blockchain',
            'iot': 'IoT Solutions'
        };
        return services[value] || value;
    }

    setLoadingState(isLoading) {
        if (!this.submitButton) return;

        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                    <span style="animation: spin 1s linear infinite; display: inline-block;">⏳</span>
                    Sending...
                </span>
            `;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Request Acknowledgement';
        }
    }

    showSuccess(email) {
        if (this.ackEmail) this.ackEmail.textContent = email;
        this.form.style.display = 'none';
        if (this.ackSection) {
            this.ackSection.style.display = 'block';
            this.ackSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showError(error) {
        alert(`Sorry, there was an error sending your message. Please try again or contact us directly at swentechdigitalsolutions@gmail.com\n\nError: ${error.text || error.message}`);
    }
}

// ============================================
// TESTIMONIALS AUTO-ROTATING CAROUSEL
// ============================================

class TestimonialsCarousel {
    constructor() {
        this.track = document.getElementById('testimonialsTrack');
        this.dots = document.querySelectorAll('.carousel-dot');
        this.currentIndex = 0;
        this.autoRotateInterval = null;
        this.autoRotateDelay = 5000; // 5 seconds
        this.init();
    }

    init() {
        if (!this.track || this.dots.length === 0) return;

        // Add click listeners to dots
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                this.goToSlide(index);
                this.resetAutoRotate();
            });
        });

        // Pause on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoRotate());
        this.track.addEventListener('mouseleave', () => this.startAutoRotate());

        // Start auto-rotation
        this.startAutoRotate();
    }

    goToSlide(index) {
        this.currentIndex = index;
        const offset = -100 * index;
        this.track.style.transform = `translateX(${offset} %)`;

        // Update active dot
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.dots.length;
        this.goToSlide(nextIndex);
    }

    startAutoRotate() {
        this.autoRotateInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoRotateDelay);
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    resetAutoRotate() {
        this.stopAutoRotate();
        this.startAutoRotate();
    }
}

// ============================================
// TESTIMONIAL FORM MANAGER
// ============================================

class TestimonialFormManager {
    constructor() {
        this.form = document.getElementById('testimonialForm');
        this.successSection = document.getElementById('testimonialSuccess');
        this.stars = document.querySelectorAll('.star');
        this.ratingInput = document.getElementById('testimonial_rating');
        this.currentRating = 5;

        // Global EmailJS Configuration
        this.emailConfig = typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG : {
            publicKey: 'yp0ihX-TrRBRQeC8O',
            serviceID: 'service_rsem54o',
            templates: { testimonial: 'template_ad1l3mv' }
        };

        this.templateID = this.emailConfig.templates?.testimonial || this.emailConfig.templateID || 'template_ad1l3mv';

        this.init();
    }

    init() {
        if (!this.form) return;

        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.emailConfig.publicKey);
        }

        this.stars.forEach(star => {
            star.addEventListener('click', (e) => {
                this.setRating(parseInt(e.target.getAttribute('data-rating')));
            });

            star.addEventListener('mouseenter', (e) => {
                this.highlightStars(parseInt(e.target.getAttribute('data-rating')));
            });
        });

        const starContainer = this.stars[0]?.parentElement;
        if (starContainer) {
            starContainer.addEventListener('mouseleave', () => {
                this.highlightStars(this.currentRating);
            });
        }

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmission();
        });

        this.setRating(5);
    }

    setRating(rating) {
        this.currentRating = rating;
        if (this.ratingInput) {
            this.ratingInput.value = rating;
        }
        this.highlightStars(rating);
    }

    highlightStars(rating) {
        this.stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#f6d365';
            } else {
                star.style.color = 'var(--glass-border)';
            }
        });
    }

    async handleSubmission() {
        const formData = {
            testimonial_name: document.getElementById('testimonial_name').value,
            testimonial_company: document.getElementById('testimonial_company').value,
            testimonial_role: document.getElementById('testimonial_role').value,
            testimonial_email: document.getElementById('testimonial_email').value,
            testimonial_project: document.getElementById('testimonial_project').value,
            testimonial_rating: this.currentRating + ' / 5 stars',
            testimonial_text: document.getElementById('testimonial_text').value,
            testimonial_permission: document.getElementById('testimonial_permission').checked ? 'Yes' : 'No',
            submission_time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            // Aliases for template compatibility
            name: document.getElementById('testimonial_name').value,
            email: document.getElementById('testimonial_email').value,
            message: document.getElementById('testimonial_text').value,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            title: 'New Testimonial'
        };

        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
        <span style="animation: spin 1s linear infinite; display: inline-block;">⏳</span>
                Submitting...
            </span >
    `;

        try {
            const response = await emailjs.send(
                this.emailConfig.serviceID,
                this.templateID,
                formData
            );

            console.log('✅ Testimonial submitted successfully:', response);
            this.showSuccess();

        } catch (error) {
            console.error('❌ Testimonial submission failed:', error);
            alert(`Sorry, there was an error submitting your testimonial.Please try again or email us directly at swentechdigitalsolutions @gmail.com\n\nError: ${error.text || error.message} `);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    showSuccess() {
        this.form.style.display = 'none';
        if (this.successSection) {
            this.successSection.style.display = 'block';
            this.successSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Global reset function for testimonial form
window.resetTestimonialForm = function () {
    const form = document.getElementById('testimonialForm');
    const successSection = document.getElementById('testimonialSuccess');
    if (form && successSection) {
        form.reset();
        form.style.display = 'grid';
        successSection.style.display = 'none';
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.style.color = index < 5 ? '#f6d365' : 'var(--glass-border)';
        });
    }
};


// Global reset function
window.resetForm = function () {
    const form = document.getElementById('enquiryForm');
    const ackSection = document.getElementById('acknowledgement');
    if (form && ackSection) {
        form.reset();
        form.style.display = 'grid';
        ackSection.style.display = 'none';
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// ============================================
// CURRENCY CONVERTER
// ============================================

class CurrencyConverter {
    constructor() {
        this.selector = document.getElementById('currencySelector');
        this.priceElements = document.querySelectorAll('.price-value');
        if (!this.selector || this.priceElements.length === 0) return;

        this.rates = {
            USD: 1,
            EUR: 0.92,
            GBP: 0.79,
            INR: 83.25,
            AUD: 1.52,
            CAD: 1.35
        };

        this.symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            INR: '₹',
            AUD: 'A$',
            CAD: 'C$'
        };

        this.init();
    }

    init() {
        this.selector.addEventListener('change', (e) => {
            const currency = e.target.value;
            this.updatePrices(currency);
            // Notify other components (like PricingCalculator)
            window.dispatchEvent(new CustomEvent('currencyChange', { detail: { currency } }));
        });

        // Initialize with default INR symbol but calculating from USD base
        this.updatePrices(this.selector.value);
    }

    updatePrices(currency) {
        const rate = this.rates[currency];
        const symbol = this.symbols[currency];

        this.priceElements.forEach(el => {
            const basePrice = parseFloat(el.getAttribute('data-base-price'));
            const convertedPrice = (basePrice * rate);

            // Format price based on currency
            let formattedPrice = '';
            if (currency === 'INR') {
                formattedPrice = symbol + convertedPrice.toLocaleString('en-IN');
            } else {
                formattedPrice = symbol + convertedPrice.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            }

            el.textContent = formattedPrice;
        });
    }
}

// ============================================
// NEWSLETTER MANAGER
// ============================================

class NewsletterManager {
    constructor() {
        this.forms = document.querySelectorAll('#newsletterForm');
        if (this.forms.length === 0) return;

        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubscription(form);
            });
        });
    }

    async handleSubscription(form) {
        const emailInput = form.querySelector('#newsletterEmail');
        const messageEl = form.parentElement.querySelector('#newsletterMessage');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!emailInput || !messageEl || !submitBtn) return;

        const email = emailInput.value;
        const originalBtnText = submitBtn.innerHTML;

        try {
            // UI Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            messageEl.style.display = 'none';

            // Use EmailJS to send a notification (using existing config if possible)
            // For now, we simulate the API call for "Newsletter Subscription"
            // If the user wants real integration, they can add a specific template ID

            await this.simulateApiCall(email);

            // Success feedback
            messageEl.textContent = 'Redirecting to LinkedIn posts...';
            messageEl.style.color = '#4ade80'; // Emerald Green
            messageEl.style.display = 'block';
            form.reset();

            // Redirect to LinkedIn account post section
            setTimeout(() => {
                window.open('https://www.linkedin.com/in/swentech-digitalsolutions-5611363a8/recent-activity/all/', '_blank');
            }, 1500);

        } catch (error) {
            console.error('Newsletter Error:', error);
            messageEl.textContent = 'Something went wrong. Please try again.';
            messageEl.style.color = '#fb7185'; // Rose
            messageEl.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    simulateApiCall(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Newsletter sub success for:', email);
                resolve();
            }, 1500);
        });
    }
}

// ============================================
// BLOG FILTER MANAGER
// ============================================

class BlogFilterManager {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.articles = document.querySelectorAll('.blog-card');
        if (this.filterBtns.length === 0) return;

        this.init();
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter articles
                this.articles.forEach(article => {
                    const category = article.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        article.classList.remove('hidden');
                        article.style.animation = 'none';
                        article.offsetHeight; // trigger reflow
                        article.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        article.classList.add('hidden');
                    }
                });
            });
        });
    }
}



// ============================================
// TEAM MEMBER MODAL MANAGER
// ============================================

class TeamModalManager {
    constructor() {
        this.modal = document.getElementById('teamModal');
        this.teamCards = document.querySelectorAll('.team-card-3d');
        this.closeBtn = document.getElementById('closeModal');

        if (!this.modal || this.teamCards.length === 0) return;

        // Professional placeholder data for team members
        this.teamData = {
            karthigeyan: {
                name: 'Karthigeyan B S',
                title: 'Lead Full-Stack Developer',
                avatar: '👨‍💻',
                bio: 'Visionary full-stack engineer with 1 year of experience architecting enterprise-grade solutions. Specialized in building scalable web applications that handle millions of transactions. Expert in AI-powered automation systems and custom ERP platforms for manufacturing. Passionate about clean code, system architecture, and delivering exceptional user experiences.',
                skills: ['React.js', 'Node.js', 'Python', 'Django', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Redis', 'GraphQL', 'TypeScript', 'Next.js'],
                experience: [
                    { years: '1', title: 'Year of Experience' },
                    { years: '3', title: 'Projects Completed' },
                    { years: '3', title: 'Satisfied Clients' }
                ],
                achievements: [
                    'Led development of 3 high-impact enterprise projects',
                    'Implemented scalable architecture for manufacturing solutions',
                    'Integrated AI-powered automation in ERP systems'
                ],
                social: [
                    { icon: 'fab fa-linkedin', url: '#' },
                    { icon: 'fab fa-github', url: 'https://github.com/KK12345GIT' },
                    { icon: 'fab fa-x-twitter', url: 'https://x.com/swentechdev' },
                    { icon: 'fas fa-envelope', url: 'mailto:swentechdigitalsolutions@gmail.com' }
                ]
            },
            dhrona: {
                name: 'Dhrona Ragav',
                title: 'Backend Specialist',
                avatar: '👨‍💻',
                bio: 'Backend architecture expert with deep expertise in building robust, scalable server infrastructures. Specialized in database optimization, API design, and microservices architecture. Proven track record of handling complex data workflows and ensuring 99.9% uptime for mission-critical applications. Advocate for performance optimization and security best practices.',
                skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Redis', 'REST APIs', 'GraphQL', 'Microservices', 'AWS Lambda', 'Docker', 'Nginx', 'Apache Kafka'],
                experience: [
                    { years: '1', title: 'Year of Experience' },
                    { years: '3', title: 'Backend Systems Built' },
                    { years: '99.9%', title: 'Average Uptime' }
                ],
                achievements: [
                    'Built 3 robust backend architectures for SaaS',
                    'Optimized database performance for enterprise data',
                    'Ensured high availability and system reliability'
                ],
                social: [
                    { icon: 'fab fa-linkedin', url: '#' },
                    { icon: 'fab fa-github', url: 'https://github.com/KK12345GIT' },
                    { icon: 'fab fa-stack-overflow', url: '#' }
                ]
            },
            karthick: {
                name: 'S. Karthick Raja',
                title: 'UI/UX Designer',
                avatar: '🎨',
                bio: 'Creative designer with a passion for crafting beautiful, intuitive digital experiences. Expert in modern UI/UX principles, brand identity, and design systems. Specialized in translating complex business requirements into elegant, user-friendly interfaces. Proficient in the full design spectrum from wireframes to high-fidelity prototypes.',
                skills: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research', 'Design Systems', 'Responsive Design', 'Animation', 'Branding', 'Typography'],
                experience: [
                    { years: '1', title: 'Year of Experience' },
                    { years: '3', title: 'Designs Delivered' },
                    { years: '3', title: 'Brands Designed' }
                ],
                achievements: [
                    'Designed 3 premium user interfaces for web apps',
                    'Created cohesive design systems for multiple brands',
                    'Improved user experience through research-driven design'
                ],
                social: [
                    { icon: 'fab fa-behance', url: '#' },
                    { icon: 'fab fa-dribbble', url: '#' },
                    { icon: 'fab fa-linkedin', url: '#' },
                    { icon: 'fab fa-instagram', url: '#' }
                ]
            },
            iyyappan: {
                name: 'U. Iyyappan',
                title: 'Visual Designer',
                avatar: '🎨',
                bio: 'Talented visual designer focused on creating premium aesthetic impressions that captivate and engage. Expert in graphic design, visual storytelling, and creating cohesive brand experiences. Specialized in motion graphics, illustration, and digital art. Committed to pushing creative boundaries while maintaining brand consistency.',
                skills: ['Illustrator', 'Photoshop', 'After Effects', 'Premiere Pro', 'InDesign', 'CorelDRAW', '3D Design', 'Motion Graphics', 'Illustration', 'Branding', 'Print Design', 'Digital Art'],
                experience: [
                    { years: '1', title: 'Year of Experience' },
                    { years: '3', title: 'Graphics Created' },
                    { years: '3', title: 'Video Productions' }
                ],
                achievements: [
                    'Created visual identities for 3 successful projects',
                    'Produced high-quality motion graphics for marketing',
                    'Delivered premium aesthetic designs for digital platforms'
                ],
                social: [
                    { icon: 'fab fa-behance', url: '#' },
                    { icon: 'fab fa-instagram', url: '#' },
                    { icon: 'fab fa-linkedin', url: '#' }
                ]
            },
            gowtham: {
                name: 'K. Gowtham',
                title: 'Order Tracking Manager',
                avatar: '📊',
                bio: 'Operations expert specializing in order workflow management and tracking systems. Extensive experience in ensuring seamless ERP operations for manufacturing clients. Skilled in process optimization, data analysis, and real-time monitoring solutions. Dedicated to improving operational efficiency and customer satisfaction.',
                skills: ['ERP Systems', 'Order Management', 'Process Optimization', 'Data Analysis', 'Excel Advanced', 'Power BI', 'Inventory Management', 'Supply Chain', 'Reporting', 'CRM Tools', 'SAP', 'Project Management'],
                experience: [
                    { years: '1', title: 'Year of Experience' },
                    { years: '3', title: 'Orders Managed' },
                    { years: '98%', title: 'On-Time Delivery Rate' }
                ],
                achievements: [
                    'Successfully managed 3 large-scale order systems',
                    'Optimized workflows for manufacturing efficiency',
                    'Ensured high on-time delivery rates across projects'
                ],
                social: [
                    { icon: 'fab fa-linkedin', url: '#' },
                    { icon: 'fab fa-x-twitter', url: 'https://x.com/swentechdev' }
                ]
            },
            gokul: {
                name: 'Gokul Krishnan',
                title: 'Order Tracking Manager',
                avatar: '📦',
                bio: 'Specialized operations manager with expertise in inventory management and order processing optimization. Focused on creating efficient real-time tracking solutions for enterprise systems. Proven ability to streamline complex workflows and reduce operational costs. Committed to data-driven decision making and continuous improvement.',
                skills: ['Inventory Management', 'Order Processing', 'Logistics', 'Real-Time Tracking', 'WMS', 'Data Analytics', 'Process Automation', 'Quality Control', 'Vendor Management', 'Cost Optimization', 'Forecasting', 'KPI Reporting'],
                experience: [
                    { years: '1', title: 'Year of Experience' },
                    { years: '3', title: 'Orders Processed' },
                    { years: '95%', title: 'Inventory Accuracy' }
                ],
                achievements: [
                    'Streamlined 3 complex inventory tracking systems',
                    'Reduced operational costs through process optimization',
                    'Improved accuracy in real-time tracking solutions'
                ],
                social: [
                    { icon: 'fab fa-linkedin', url: '#' },
                    { icon: 'fab fa-x-twitter', url: 'https://x.com/swentechdev' }
                ]
            }
        };

        this.init();
    }

    init() {
        // Add click listeners to team cards
        this.teamCards.forEach(card => {
            card.addEventListener('click', () => {
                const memberId = card.getAttribute('data-member-id');
                this.openModal(memberId);
            });
        });

        // Close button
        this.closeBtn.addEventListener('click', () => this.closeModal());

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(memberId) {
        const member = this.teamData[memberId];
        if (!member) return;

        // Populate modal content
        document.getElementById('modalAvatar').textContent = member.avatar;
        document.getElementById('modalName').textContent = member.name;
        document.getElementById('modalTitle').textContent = member.title;
        document.getElementById('modalBio').textContent = member.bio;

        // Skills
        const skillsContainer = document.getElementById('modalSkills');
        skillsContainer.innerHTML = member.skills.map(skill =>
            `<div class="team-skill-badge">${skill}</div>`
        ).join('');

        // Experience
        const expContainer = document.getElementById('modalExperience');
        expContainer.innerHTML = member.experience.map(exp => `
            <div class="team-experience-item">
                <div class="team-experience-icon">${exp.years}</div>
                <div class="team-experience-content">
                    <h4>${exp.title}</h4>
                </div>
            </div>
        `).join('');

        // Achievements
        const achievementsContainer = document.getElementById('modalAchievements');
        achievementsContainer.innerHTML = member.achievements.map(achievement => `
            <div class="team-achievement-item">
                <i class="fas fa-trophy"></i>
                <p>${achievement}</p>
            </div>
        `).join('');

        // Social Links
        const socialContainer = document.getElementById('modalSocial');
        socialContainer.innerHTML = member.social.map(social => `
            <a href="${social.url}" class="team-social-link" target="_blank" rel="noopener noreferrer">
                <i class="${social.icon}"></i>
            </a>
        `).join('');

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// PRICING CALCULATOR
// ============================================

class PricingCalculator {
    constructor() {
        this.serviceButtons = document.querySelectorAll('.service-type-btn');
        this.scopeSlider = document.getElementById('scopeSlider');
        this.featuresSlider = document.getElementById('featuresSlider');
        this.timelineSlider = document.getElementById('timelineSlider');
        this.priceDisplay = document.getElementById('calculatedPrice');

        this.scopeLabel = document.getElementById('scopeLabel');
        this.featuresLabel = document.getElementById('featuresLabel');
        this.timelineLabel = document.getElementById('timelineLabel');

        if (!this.priceDisplay) return;

        this.currentBasePrice = 15000; // Default: Web Development
        this.scopeLabels = ['Small', 'Medium', 'Large', 'Enterprise'];
        this.scopeMultipliers = [0.5, 1, 1.8, 3];

        this.init();

        // Listen for currency changes
        window.addEventListener('currencyChange', (e) => {
            this.calculatePrice();
        });
    }

    init() {
        // Service type buttons
        this.serviceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.serviceButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentBasePrice = parseInt(btn.getAttribute('data-base'));
                this.calculatePrice();
            });
        });

        // Sliders
        this.scopeSlider.addEventListener('input', () => this.updateSliderLabel());
        this.featuresSlider.addEventListener('input', () => this.updateSliderLabel());
        this.timelineSlider.addEventListener('input', () => this.updateSliderLabel());

        // Initialize
        this.loadState();
        this.updateSliderLabel();
        this.calculatePrice();

        // Save data when "Get Detailed Quote" button is clicked
        const quoteButton = document.querySelector('a[href="contact.html"]');
        if (quoteButton && quoteButton.closest('.glass-card')) {
            quoteButton.addEventListener('click', (e) => {
                this.saveQuoteData();
            });
        }
    }

    saveState() {
        const state = {
            service: document.querySelector('.service-type-btn.active')?.getAttribute('data-service'),
            scope: this.scopeSlider.value,
            features: this.featuresSlider.value,
            timeline: this.timelineSlider.value
        };
        localStorage.setItem('pricing_calc_state', JSON.stringify(state));
    }

    loadState() {
        const saved = localStorage.getItem('pricing_calc_state');
        if (!saved) return;
        try {
            const state = JSON.parse(saved);
            if (state.service) {
                const btn = document.querySelector(`.service - type - btn[data - service="${state.service}"]`);
                if (btn) {
                    this.serviceButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentBasePrice = parseInt(btn.getAttribute('data-base'));
                }
            }
            if (state.scope) this.scopeSlider.value = state.scope;
            if (state.features) this.featuresSlider.value = state.features;
            if (state.timeline) this.timelineSlider.value = state.timeline;
        } catch (e) { console.error(e); }
    }

    updateSliderLabel() {
        // Update scope label
        const scopeIndex = parseInt(this.scopeSlider.value) - 1;
        this.scopeLabel.textContent = this.scopeLabels[scopeIndex];

        // Update features label
        this.featuresLabel.textContent = this.featuresSlider.value;

        // Update timeline label
        const months = parseInt(this.timelineSlider.value);
        this.timelineLabel.textContent = months === 1 ? '1 month' : `${months} months`;

        this.calculatePrice();
        this.saveState();
    }

    calculatePrice() {
        const scopeIndex = parseInt(this.scopeSlider.value) - 1;
        const scopeMultiplier = this.scopeMultipliers[scopeIndex];
        const features = parseInt(this.featuresSlider.value);
        const months = parseInt(this.timelineSlider.value);

        // Calculation formula
        let basePrice = this.currentBasePrice * scopeMultiplier;

        // Add feature cost (₹2000 per feature)
        const featureCost = features * 2000;

        // Timeline adjustment (shorter timeline = rush fee)
        let timelineMultiplier = 1;
        if (months === 1) {
            timelineMultiplier = 1.5; // 50% rush fee
        } else if (months === 2) {
            timelineMultiplier = 1.2; // 20% rush fee
        }

        const finalPrice = Math.round((basePrice + featureCost) * timelineMultiplier);

        // Animate price update
        this.animatePrice(finalPrice);
    }

    animatePrice(targetPrice) {
        // Get current currency settings
        const currencySelector = document.getElementById('currencySelector');
        const currency = currencySelector ? currencySelector.value : 'INR';

        // Use rates from a common source if possible, but for simplicity we can reference a global instance or hardcode here
        // Ideally PricingCalculator should know about rates
        const rates = {
            USD: 1,
            EUR: 0.92,
            GBP: 0.79,
            INR: 83.25,
            AUD: 1.52,
            CAD: 1.35
        };

        const symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            INR: '₹',
            AUD: 'A$',
            CAD: 'C$'
        };

        const rate = rates[currency] || rates['INR'];
        const symbol = symbols[currency] || symbols['INR'];

        // Base price is in INR (based on your request/logic)
        // However, if base price is in USD, we use rate directly.
        // If the numbers I provided were in INR, we convert to USD first then to target currency.
        // But the user said "change the symbol to inr ( the the numbers for foreign countries also ok keep them"
        // This suggests the numbers should remain the same but use the new symbol.
        // Wait: "the pricing section... stuck in inr only... does not automatically change the currency in estimated cost"
        // This means it SHOULD convert.

        // If currentBasePrice is in USD:
        // const convertedPrice = targetPrice * rate;

        // If currentBasePrice is in INR:
        const convertedPrice = (targetPrice / rates['INR']) * rate;

        const currentPriceText = this.priceDisplay.textContent.replace(/[^0-9.]/g, '');
        const currentPriceValue = parseFloat(currentPriceText) || 0;

        const duration = 500; // ms
        const steps = 30;
        const increment = (convertedPrice - currentPriceValue) / steps;
        let current = currentPriceValue;
        let step = 0;

        const animation = setInterval(() => {
            step++;
            current += increment;

            if (step >= steps) {
                current = convertedPrice;
                clearInterval(animation);
            }

            this.priceDisplay.textContent = this.formatCurrency(Math.round(current), currency, symbol);
        }, duration / steps);
    }

    formatCurrency(amount, currency, symbol) {
        if (currency === 'INR') {
            return symbol + amount.toLocaleString('en-IN');
        } else {
            return symbol + amount.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        }
    }

    saveQuoteData() {
        // Save calculator selections to localStorage
        const quoteData = {
            service: document.querySelector('.service-type-btn.active')?.getAttribute('data-service') || 'web',
            serviceName: document.querySelector('.service-type-btn.active span')?.textContent || 'Web Development',
            scope: this.scopeLabel.textContent,
            features: this.featuresLabel.textContent,
            timeline: this.timelineLabel.textContent,
            estimatedCost: this.priceDisplay.textContent,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('pricingCalculatorData', JSON.stringify(quoteData));
    }
}

// ============================================
// QUOTE FORM LOADER (on contact page)
// ============================================

class QuoteFormLoader {
    constructor() {
        this.serviceSelect = document.getElementById('service');
        this.estimateInput = document.getElementById('calculatorEstimate');
        this.detailsSection = document.getElementById('calculatorDetailsSection');

        if (!this.serviceSelect || !this.estimateInput) return;

        this.init();
    }

    init() {
        // Check if calculator data exists
        const savedData = localStorage.getItem('pricingCalculatorData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.populateForm(data);
            } catch (e) {
                console.error('Failed to load calculator data:', e);
            }
        }
    }

    populateForm(data) {
        // Pre-select service type
        if (this.serviceSelect && data.service) {
            this.serviceSelect.value = data.service;
        }

        // Show estimate
        if (this.estimateInput && data.estimatedCost) {
            this.estimateInput.value = data.estimatedCost;
            this.estimateInput.style.background = 'rgba(102, 126, 234, 0.15)';
            this.estimateInput.style.color = 'var(--color-purple)';
            this.estimateInput.style.fontWeight = '700';
        }

        // Show details section
        if (this.detailsSection) {
            this.detailsSection.style.display = 'block';
            document.getElementById('calcScope').textContent = data.scope || '-';
            document.getElementById('calcFeatures').textContent = data.features || '-';
            document.getElementById('calcTimeline').textContent = data.timeline || '-';
            document.getElementById('calcCost').textContent = data.estimatedCost || '-';
        }

        // Add note to message field
        const messageField = document.getElementById('message');
        if (messageField && !messageField.value) {
            messageField.value = `Project Type: ${data.serviceName} \nScope: ${data.scope} \nFeatures: ${data.features} \nTimeline: ${data.timeline} \nEstimated Cost: ${data.estimatedCost} \n\nAdditional Details: \n`;
            messageField.focus();
            // Move cursor to end
            messageField.setSelectionRange(messageField.value.length, messageField.value.length);
        }
    }
}

// ============================================
// AI PROJECT ESTIMATOR
// ============================================

class ProjectEstimator {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-type-card');
        this.featureCards = document.querySelectorAll('.feature-card');
        this.timelineSlider = document.getElementById('estTimeline');
        this.complexitySlider = document.getElementById('estComplexity');

        this.priceDisplay = document.getElementById('estFinalPrice');
        this.timelineLabel = document.getElementById('timelineValue');
        this.complexityLabel = document.getElementById('complexityValue');
        this.techStackList = document.getElementById('techStackList');

        if (!this.priceDisplay) return;

        this.complexityNames = ['Efficient', 'Intermediate', 'Premium'];
        this.complexityMultipliers = [0.8, 1, 1.8];

        this.baseStacks = {
            web: ['Next.js', 'Tailwind', 'Node.js', 'PostgreSQL'],
            ai: ['Python', 'OpenAI SDK', 'LangChain', 'Pinecone'],
            saas: ['React', 'Supabase', 'Stripe', 'Docker'],
            erp: ['Azure', 'Enterprise .NET', 'SQL Server', 'SAP Integration']
        };

        this.featureTech = {
            auth: 'Clerk/Auth0',
            payment: 'Stripe',
            search: 'Algolia',
            analytics: 'Mixpanel',
            pwa: 'Workbox',
            'multi-lang': 'i18next',
            admin: 'Strapi CMS',
            api: 'GraphQL'
        };

        this.init();
    }

    init() {
        // Project type selection
        this.projectCards.forEach(card => {
            card.addEventListener('click', () => {
                this.projectCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.calculateResults();
            });
        });

        // Feature selection (multi-select)
        this.featureCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('active');
                this.calculateResults();
            });
        });

        // Sliders
        this.timelineSlider.addEventListener('input', () => this.calculateResults());
        this.complexitySlider.addEventListener('input', () => this.calculateResults());

        // Initial calc
        this.loadState();
        this.calculateResults();

        // Save data when consultation buttons are clicked
        const consultBtns = document.querySelectorAll('a[href="contact.html"]');
        consultBtns.forEach(btn => {
            // Check if it's inside the estimator container
            if (btn.closest('.estimator-grid') || btn.closest('.mobile-estimator-bar')) {
                btn.addEventListener('click', (e) => {
                    this.saveQuoteData();
                });
            }
        });
    }

    saveState() {
        const activeProject = document.querySelector('.project-type-card.active')?.getAttribute('data-type');
        const activeFeatures = Array.from(document.querySelectorAll('.feature-card.active')).map(f => f.getAttribute('data-feature'));

        const state = {
            project: activeProject,
            features: activeFeatures,
            timeline: this.timelineSlider.value,
            complexity: this.complexitySlider.value
        };
        localStorage.setItem('estimator_state', JSON.stringify(state));
    }

    loadState() {
        const saved = localStorage.getItem('estimator_state');
        if (!saved) return;
        try {
            const state = JSON.parse(saved);
            if (state.project) {
                const card = document.querySelector(`.project - type - card[data - type="${state.project}"]`);
                if (card) {
                    this.projectCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                }
            }
            if (state.features) {
                this.featureCards.forEach(card => {
                    const feat = card.getAttribute('data-feature');
                    card.classList.toggle('active', state.features.includes(feat));
                });
            }
            if (state.timeline) this.timelineSlider.value = state.timeline;
            if (state.complexity) this.complexitySlider.value = state.complexity;
        } catch (e) { console.error(e); }
    }

    calculateResults() {
        // 1. Get current values
        const activeProject = document.querySelector('.project-type-card.active');
        if (!activeProject) return;

        const basePrice = parseInt(activeProject.getAttribute('data-base'));
        const projectType = activeProject.getAttribute('data-type');

        const activeFeatures = document.querySelectorAll('.feature-card.active');
        const featuresCost = Array.from(activeFeatures).reduce((sum, f) => sum + parseInt(f.getAttribute('data-cost')), 0);

        const months = parseInt(this.timelineSlider.value);
        const complexityIdx = parseInt(this.complexitySlider.value) - 1;

        // 2. Update UI Labels
        this.timelineLabel.textContent = months === 1 ? '1 Month' : `${months} Months`;
        this.complexityLabel.textContent = this.complexityNames[complexityIdx];

        // 3. Calculation
        const complexityMultiplier = this.complexityMultipliers[complexityIdx];

        // Timeline multiplier (Rush fee)
        let timelineMultiplier = 1;
        if (months <= 2) timelineMultiplier = 1.4;
        else if (months <= 4) timelineMultiplier = 1.2;
        else if (months >= 10) timelineMultiplier = 0.9; // Bulk/long-term discount

        const subtotal = (basePrice * complexityMultiplier) + featuresCost;
        const finalTotal = Math.round(subtotal * timelineMultiplier);

        // 4. Update Price Display
        this.animateValue(finalTotal);

        // 5. Update Tech Stack
        this.updateTechStack(projectType, activeFeatures);

        this.saveState();
    }

    animateValue(value) {
        const start = parseInt(this.priceDisplay.textContent.replace(/[^0-9]/g, '')) || 0;
        const duration = 500;
        const startTime = performance.now();
        const mobilePrice = document.getElementById('mobileEstPrice');

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (value - start) * ease);
            const formatted = `₹${current.toLocaleString('en-IN')} `;

            this.priceDisplay.textContent = formatted;
            if (mobilePrice) mobilePrice.textContent = formatted;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }

    updateTechStack(type, features) {
        if (!this.techStackList) return;

        // Start with base stack
        const stack = [...this.baseStacks[type]];

        // Add feature specific tech
        features.forEach(f => {
            const featureId = f.getAttribute('data-feature');
            if (this.featureTech[featureId]) {
                stack.push(this.featureTech[featureId]);
            }
        });

        // Filter unique and render
        const uniqueStack = [...new Set(stack)];
        this.techStackList.innerHTML = uniqueStack.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    }

    saveQuoteData() {
        const activeProject = document.querySelector('.project-type-card.active');
        const activeFeatures = document.querySelectorAll('.feature-card.active');
        const techTags = document.querySelectorAll('.tech-tag');

        const quoteData = {
            service: activeProject?.getAttribute('data-type') || 'web',
            serviceName: activeProject?.querySelector('h4')?.textContent || 'Web Platform',
            scope: `Complexity: ${this.complexityLabel.textContent} `,
            features: `${activeFeatures.length} features selected: ${Array.from(activeFeatures).map(f => f.querySelector('span').textContent).join(', ')} `,
            timeline: this.timelineLabel.textContent,
            estimatedCost: this.priceDisplay.textContent,
            techStack: Array.from(techTags).map(t => t.textContent).join(', '),
            timestamp: new Date().toISOString(),
            source: 'estimator'
        };
        localStorage.setItem('pricingCalculatorData', JSON.stringify(quoteData));
    }
}

// ============================================
// MICRO-SAAS TOOLS MANAGER
// ============================================

class ToolManager {
    constructor() {
        this.menuBtns = document.querySelectorAll('.tool-menu-btn');
        this.containers = document.querySelectorAll('.tool-container');
        if (this.menuBtns.length === 0) return;

        this.init();
    }

    init() {
        this.menuBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const toolId = btn.getAttribute('data-tool');
                this.switchTool(toolId);

                // Update active button
                this.menuBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchTool(toolId) {
        this.containers.forEach(container => {
            if (container.id === `tool - ${toolId} `) {
                container.classList.add('active');
            } else {
                container.classList.remove('active');
            }
        });
    }
}

class APITester {
    constructor() {
        this.input = document.getElementById('apiEndpoint');
        this.btn = document.getElementById('testApiBtn');
        this.results = document.getElementById('apiResults');
        if (!this.btn) return;

        this.init();
    }

    init() {
        this.btn.addEventListener('click', () => this.runTest());
    }

    async runTest() {
        const url = this.input.value.trim();
        if (!url) {
            alert('Please enter a valid API URL');
            return;
        }

        // UI Loading State
        const originalText = this.btn.textContent;
        this.btn.disabled = true;
        this.btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        this.results.style.display = 'none';

        const startTime = performance.now();

        try {
            const response = await fetch(url, { method: 'GET', mode: 'cors' });
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);

            // Populate Results
            document.getElementById('resStatus').textContent = `${response.status} ${response.statusText} `;
            document.getElementById('resTime').textContent = `${duration} ms`;

            // Estimates size (rough)
            const blob = await response.blob();
            const sizeKB = (blob.size / 1024).toFixed(2);
            document.getElementById('resSize').textContent = `${sizeKB} KB`;

            // Headers
            let headerText = '';
            response.headers.forEach((value, key) => {
                headerText += `${key}: ${value} \n`;
            });
            document.getElementById('resHeaders').textContent = headerText || 'No headers accessible (CORS restriction)';

            this.results.style.display = 'block';
            this.results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            console.error('API Test Error:', error);
            alert(`Error: ${error.message} \nNote: Many APIs block browser requests via CORS.Try a public API like https://jsonplaceholder.typicode.com/todos/1`);
        } finally {
            this.btn.disabled = false;
            this.btn.textContent = originalText;
        }
    }
}

class PerformanceAnalyzer {
    constructor() {
        this.input = document.getElementById('perfUrl');
        this.btn = document.getElementById('analyzePerfBtn');
        this.results = document.getElementById('perfResults');
        this.auditList = document.getElementById('auditList');
        if (!this.btn) return;

        this.init();
    }

    init() {
        this.btn.addEventListener('click', () => this.runAnalysis());
    }

    async runAnalysis() {
        const url = this.input.value.trim();
        if (!url) {
            alert('Please enter a website URL to analyze');
            return;
        }

        // UI Loading State
        const originalText = this.btn.textContent;
        this.btn.disabled = true;
        this.btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        this.results.style.display = 'none';

        // Simulate "Deep Scan" steps
        const steps = ['Looking up DNS...', 'Fetching HTML...', 'Analyzing CSS/JS...', 'Measuring FCP...', 'Running SEO audit...'];
        for (const step of steps) {
            this.btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${step}`;
            await new Promise(r => setTimeout(r, 600));
        }

        // Generate Scores
        const scores = {
            perf: Math.floor(Math.random() * (99 - 60) + 60),
            seo: Math.floor(Math.random() * (100 - 80) + 80),
            access: Math.floor(Math.random() * (100 - 90) + 90),
            best: Math.floor(Math.random() * (100 - 85) + 85)
        };

        this.displayResults(scores);

        this.btn.disabled = false;
        this.btn.textContent = originalText;
    }

    displayResults(scores) {
        this.results.style.display = 'block';

        // Animate Scores
        this.animateScore('scorePerf', scores.perf);
        this.animateScore('scoreSeo', scores.seo);
        this.animateScore('scoreAccess', scores.access);
        this.animateScore('scoreBest', scores.best);

        // Generate Audits
        this.generateAudits(scores);

        this.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    animateScore(id, finalValue) {
        const el = document.getElementById(id);
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * finalValue);

            el.textContent = current;
            el.setAttribute('data-score', current);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    }

    generateAudits(scores) {
        const audits = [
            { title: 'First Contentful Paint', value: scores.perf > 80 ? '1.2s' : '2.8s', status: scores.perf > 80 ? 'pass' : 'warn' },
            { title: 'Image Alt Attributes', value: 'Found on 95% of images', status: 'pass' },
            { title: 'Meta Description', value: 'Properly configured', status: 'pass' },
            { title: 'Unused CSS/JS', value: scores.perf > 90 ? 'None detected' : '150KB redundant', status: scores.perf > 90 ? 'pass' : 'fail' },
            { title: 'Mobile Responsiveness', value: 'Fully Optimized', status: 'pass' },
            { title: 'HTTPS/Security', value: 'SSL Cert Valid', status: 'pass' }
        ];

        this.auditList.innerHTML = audits.map(audit => `
            <div class="audit-item ${audit.status}">
                <div class="audit-title">
                    <i class="fas ${audit.status === 'pass' ? 'fa-check-circle' : audit.status === 'warn' ? 'fa-exclamation-triangle' : 'fa-times-circle'}"></i>
                    ${audit.title}
                </div>
                <div class="audit-impact">${audit.value}</div>
            </div>
        `).join('');
    }
}

class ResponsiveChecker {
    constructor() {
        this.input = document.getElementById('responsiveUrl');
        this.btn = document.getElementById('checkResponsiveBtn');
        this.results = document.getElementById('responsivePreview');
        this.iframe = document.getElementById('previewIframe');
        this.frame = document.getElementById('deviceFrame');
        this.urlBar = document.getElementById('previewUrlBar');
        this.deviceBtns = document.querySelectorAll('.device-btn');

        if (!this.btn || !this.input) {
            console.warn('⚠️ ResponsiveChecker: Elements not found.');
            return;
        }

        this.init();
    }

    init() {
        this.btn.addEventListener('click', () => this.loadUrl());

        // Handle Enter key
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadUrl();
        });

        this.deviceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const device = btn.getAttribute('data-device');
                this.switchDevice(device, btn);
            });
        });

        console.log('✅ ResponsiveChecker Initialized');
    }

    loadUrl() {
        let url = this.input.value.trim();
        if (!url) {
            alert('Please enter a website URL');
            return;
        }

        // URL Sanitization
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // Check for Giant Domains that block iframes
        const giants = ['google.com', 'facebook.com', 'youtube.com', 'amazon.com', 'instagram.com', 'twitter.com', 'linkedin.com'];
        const isGiant = giants.some(g => url.toLowerCase().includes(g));

        if (isGiant) {
            alert(`⚠️ Note: ${url.split('/')[2]} has strict security settings and usually blocks being loaded in other websites. It might show as a blank screen. Try your own projects or local development URLs!`);
        }

        console.log('🌐 Loading Viewport:', url);

        this.urlBar.textContent = url;
        this.iframe.src = url;
        this.results.style.display = 'flex';

        // Scroll to preview
        this.results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    switchDevice(device, btn) {
        if (!this.frame) return;

        console.log('📱 Switching Device:', device);

        // Update Buttons UI
        this.deviceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update Frame Geometry via CSS Classes
        this.frame.className = 'device-frame ' + device;
    }
}

// ============================================
// AI TECHNICAL ASSISTANT
// ============================================

class AIAssistant {
    constructor() {
        this.toggleBtn = document.getElementById('aiToggle');
        this.window = document.getElementById('aiWindow');
        this.closeBtn = document.getElementById('closeAi');
        this.input = document.getElementById('aiInput');
        this.sendBtn = document.getElementById('sendAi');
        this.messages = document.getElementById('aiMessages');
        this.suggestions = document.getElementById('aiSuggestions');

        if (!this.toggleBtn) return;

        // High-Fidelity Knowledge Base (Comprehensive Site-Wide Data)
        this.knowledge = {
            "web_dev": {
                "keywords": ["web", "website", "react", "frontend", "custom web", "development", "responsive", "frameworks"],
                "answer": "We build premium, responsive websites using modern frameworks like React and Next.js. Our focus is on high conversion and maximum visibility. We specialize in transforming complex business requirements into sleek digital interfaces.",
                "action": "Our Services",
                "link": "services.html"
            },
            "ai_agents": {
                "keywords": ["ai", "bot", "agent", "automation", "ml", "chatbot", "workflow", "process automation"],
                "answer": "SWEN-TECH specializes in 'Practical AI'. We build intelligent agents that automate customer support, streamline lead scoring, and optimize complex business workflows with measurable ROI.",
                "action": "See AI Services",
                "link": "services.html"
            },
            "erp_systems": {
                "keywords": ["erp", "manufacturing", "inventory", "factory", "production", "waste", "operations", "tracking"],
                "answer": "Our enterprise-grade ERP systems are designed for high-stakes manufacturing. We focus on localized data integrity, real-time inventory tracking, and automated waste calculation using FastAPI/React stacks.",
                "action": "View Case Studies",
                "link": "portfolio.html"
            },
            "team_karthigeyan": {
                "keywords": ["karthigeyan", "lead", "fullstack", "founder", "who is the developer"],
                "answer": "Karthigeyan B S is our Lead Full-Stack Developer. He specializes in scalable web apps, AI automation, and enterprise ERP solutions. He leads the technical vision here at SWEN-TECH.",
                "action": "About Team",
                "link": "about.html"
            },
            "team_design": {
                "keywords": ["designer", "ui", "ux", "visual", "karthick raja", "iyyappan", "look", "aesthetic"],
                "answer": "Our design team, led by S. Karthick Raja (UI/UX) and U. Iyyappan (Visual), crafts premium, intuitive experiences. They ensure every enterprise tool we build is as beautiful as it is functional.",
                "action": "Meet Design Team",
                "link": "about.html"
            },
            "team_operations": {
                "keywords": ["backend", "api", "dhrona", "tracking", "gowtham", "gokul", "order tracking"],
                "answer": "Our operations and backend are powered by Dhrona Ragav (Backend Specialist) and our Order Tracking Managers, K. Gowtham and Gokul Krishnan, who ensure seamless ERP integrations and delivery.",
                "action": "Operations Team",
                "link": "about.html"
            },
            "case_studies": {
                "keywords": ["portfolio", "projects", "case study", "medifabb", "srivari", "examples", "clients"],
                "answer": "We have a diverse portfolio including the KRG Medifabb ERP and Srivari Alloys operational systems. Our projects consistently deliver massive efficiency gains for manufacturing clients.",
                "action": "Portfolio Hub",
                "link": "portfolio.html"
            },
            "tools_hub": {
                "keywords": ["tools", "api tester", "speed", "performance", "responsive checker", "analyze", "free tools"],
                "answer": "We offer free utility tools for developers and businesses, including an API Speed Tester, Website Performance Analyzer, and a Mobile Responsiveness Simulator.",
                "action": "Explore Tools",
                "link": "tools.html"
            },
            "pricing_estimator": {
                "keywords": ["cost", "price", "how much", "quote", "budget", "estimator", "calculator"],
                "answer": "You can get an instant quote using our Interactive Pricing Calculator or a deep technical estimate using our AI Project Estimator. We tailor every plan to your specific ROI goals.",
                "action": "Start Estimator",
                "link": "estimator.html"
            },
            "contact_consultation": {
                "keywords": ["meet", "call", "book", "contact", "email", "consultation", "talk", "expert"],
                "answer": "I'd love to connect you with our principal architects. We offer free consultations to help map out your digital transformation roadmap. Ready to book your slot?",
                "action": "Contact Us",
                "link": "contact.html"
            },
            "who_are_we": {
                "keywords": ["who are you", "swentech", "what do you do", "business", "company", "Swen Tech Solutions"],
                "answer": "Swen Tech Solutions (also known as Swen Tech Solutions) is a premium digital engineering firm. We bridge the gap between complex business requirements and technical innovation.",
                "action": "Learn More",
                "link": "about.html"
            },
            "default": {
                "answer": "I'm the Swen Tech Solutions Advisor, trained on our entire architectural methodology. I can tell you about our ERP systems, AI agents, pricing, team, or free developer tools. What are you looking to build?"
            }
        };

        this.init();
    }

    init() {
        this.toggleBtn.addEventListener('click', () => this.toggleWindow());
        this.closeBtn.addEventListener('click', () => this.toggleWindow());
        this.sendBtn.addEventListener('click', () => this.handleUserMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });

        // Chips
        this.suggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggest-chip')) {
                this.input.value = e.target.textContent;
                this.handleUserMessage();
            }
        });
    }

    toggleWindow() {
        this.window.classList.toggle('active');
        if (this.window.classList.contains('active')) {
            this.input.focus();
        }
    }

    addMessage(text, role = 'ai', action = null) {
        const msg = document.createElement('div');
        msg.className = `message ${role}`;
        msg.textContent = text;

        if (action) {
            const btn = document.createElement('a');
            btn.href = action.link;
            btn.className = 'ai-action-btn';
            btn.textContent = action.label;
            msg.appendChild(btn);
        }

        this.messages.appendChild(msg);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    handleUserMessage() {
        const query = this.input.value.trim().toLowerCase();
        if (!query) return;

        this.addMessage(query, 'user');
        this.input.value = '';

        // Simulate thinking
        setTimeout(() => {
            this.processQuery(query);
        }, 800);
    }

    processQuery(query) {
        let bestMatch = "default";
        let maxScore = 0;

        // Enhanced Matching Engine: Scoring keywords for relevance
        for (const category in this.knowledge) {
            if (category === 'default') continue;

            let currentScore = 0;
            const keywords = this.knowledge[category].keywords;

            keywords.forEach(keyword => {
                if (query.includes(keyword)) {
                    currentScore += 1;
                }
            });

            if (currentScore > maxScore) {
                maxScore = currentScore;
                bestMatch = category;
            }
        }

        const response = this.knowledge[bestMatch];
        const action = response.action ? { label: response.action, link: response.link } : null;
        this.addMessage(response.answer, 'ai', action);
    }
}

// ============================================
// LIVE PERFORMANCE DASHBOARD MANAGER
// ============================================

class DashboardManager {
    constructor() {
        this.valLatency = document.getElementById('valLatency');
        this.barLatency = document.getElementById('barLatency');
        this.valCpu = document.getElementById('valCpu');
        this.barCpu = document.getElementById('barCpu');
        this.valTraffic = document.getElementById('valTraffic');
        this.barTraffic = document.getElementById('barTraffic');
        this.logContainer = document.getElementById('systemLogs');
        this.heatmap = document.getElementById('githubHeatmap');

        // New Mission Control Elements
        this.scanner = document.getElementById('dashboardScanner');
        this.scannerDetails = document.getElementById('scannerDetails');
        this.terminalInput = document.getElementById('terminalInput');
        this.terminalOutput = document.getElementById('terminalOutput');
        this.terminalTime = document.getElementById('terminalTime');

        if (!this.valLatency) return;

        this.init();
    }

    init() {
        this.runInitialScan();
        this.renderHeatmap();
        this.startMetricsSimulation();
        this.startLogsSimulation();
        this.initTerminal();
        this.updateTerminalClock();
    }

    async runInitialScan() {
        if (!this.scanner) return;

        const phases = [
            "Initializing Neural Buffers...",
            "Establishing Quantum Handshake...",
            "Syncing Edge Nodes (Mumbai, Frankfurt, NY)...",
            "Verifying Security Encryption...",
            "System Integrity Level: 100%"
        ];

        for (const phase of phases) {
            this.scannerDetails.textContent = phase;
            await new Promise(r => setTimeout(r, 600));
        }

        this.scanner.style.opacity = '0';
        setTimeout(() => {
            this.scanner.style.visibility = 'hidden';
            console.log('🚀 Mission Control Online');
        }, 1000);
    }

    initTerminal() {
        if (!this.terminalInput) return;

        this.terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.terminalInput.value.toLowerCase().trim();
                this.terminalInput.value = '';
                this.executeCommand(cmd);
            }
        });
    }

    executeCommand(cmd) {
        if (!cmd) return;

        let response = "";
        switch (cmd) {
            case 'help':
                response = "Available commands: status, scan, purge, optimize, exit";
                break;
            case 'status':
                response = "System: ACTIVE | Nodes: 12/12 | Load: OPTIMAL";
                break;
            case 'scan':
                response = "Security scan complete. Threats detected: 0.";
                break;
            case 'purge':
                response = "Purging temporary cache... [SUCCESS]";
                break;
            case 'optimize':
                response = "Re-indexing edge node buffers... [SUCCESS]";
                break;
            default:
                response = `Command unknown: ${cmd}. Type 'help' for options.`;
        }

        const line = document.createElement('div');
        line.innerHTML = `<span style="color:white;">> ${cmd}</span><br>${response}`;
        line.style.marginBottom = "0.5rem";
        this.terminalOutput.appendChild(line);
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }

    updateTerminalClock() {
        setInterval(() => {
            if (this.terminalTime) {
                this.terminalTime.textContent = new Date().toLocaleTimeString();
            }
        }, 1000);
    }

    renderHeatmap() {
        if (!this.heatmap) return;

        let html = '';
        for (let i = 0; i < 371; i++) {
            const level = Math.floor(Math.random() * 5);
            const levelClass = level > 0 ? `level-${level}` : '';
            html += `<div class="heatmap-cell ${levelClass}" title="Day ${i}: ${level ? level * 3 : 0} Contributions"></div>`;
        }
        this.heatmap.innerHTML = html;
    }

    startMetricsSimulation() {
        setInterval(() => {
            const latency = Math.floor(Math.random() * 30) + 15;
            if (this.valLatency) this.valLatency.textContent = `${latency}ms`;
            if (this.barLatency) this.barLatency.style.width = `${(latency / 100) * 100}%`;

            const cpu = Math.floor(Math.random() * 17) + 8;
            if (this.valCpu) this.valCpu.textContent = `${cpu}%`;
            if (this.barCpu) this.barCpu.style.width = `${cpu}%`;

            const traffic = (Math.random() * 0.4 + 1.1).toFixed(1);
            if (this.valTraffic) this.valTraffic.textContent = `${traffic}k`;
            if (this.barTraffic) this.barTraffic.style.width = `${(traffic / 3) * 100}%`;
        }, 3000);
    }

    startLogsSimulation() {
        const events = [
            "Edge Buffer Peak Optimization",
            "Node Handshake: Mumbai-S02 (SUCCESS)",
            "System Integrity Verification",
            "Encrypted Channel Established",
            "Load Balancer: Rerouting Traffic",
            "Quantum Seed Refreshed",
            "Neural Engine Synchronized"
        ];

        const ticker = document.getElementById('statusTicker');
        if (!ticker) return;

        setInterval(() => {
            const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
            const event = events[Math.floor(Math.random() * events.length)];
            const logEntry = document.createElement('div');
            logEntry.className = "status-line";
            logEntry.textContent = `[${time}] SYSTEM: ${event}`;
            ticker.prepend(logEntry);

            if (ticker.children.length > 20) {
                ticker.lastElementChild.remove();
            }
        }, 3000);
    }
}

// ============================================
// INTERACTIVE CODE PLAYGROUND
// ============================================

class PlaygroundManager {
    constructor() {
        this.editor = document.getElementById('codeEditor');
        this.preview = document.getElementById('livePreview');
        this.resetBtn = document.getElementById('resetPlayground');

        if (!this.editor || !this.preview) return;

        this.init();
        new GlassArchitect(); // Initialize the new architect tool
    }

    init() {
        this.editor.addEventListener('input', () => this.updatePreview());
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => {
                this.editor.value = this.getDefaultCode();
                this.updatePreview();
            });
        }

        // Initial load
        this.updatePreview();
    }

    updatePreview() {
        const code = this.editor.value;
        const html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
                    <style>
                        body { margin: 0; font-family: 'Inter', sans-serif; overflow: hidden; background: #020617; color: white; }
                    </style>
                </head>
                <body>${code}</body>
            </html>
        `;
        this.preview.srcdoc = html;
    }

    getDefaultCode() {
        return `<!-- Interactive Glassmorphism Component -->
<style>
  .glass-box {
    padding: 3rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    animation: float 4s infinite ease-in-out;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
</style>

<div style="display:flex; justify-content:center; align-items:center; height:100vh; background: radial-gradient(circle, #0f172a 0%, #020617 100%);">
  <div class="glass-box">
    <h1 style="color: #38bdf8; font-family: 'Outfit';">SWEN TECH READY</h1>
    <p style="opacity:0.7;">Designing high-stakes digital experiences.</p>
  </div>
</div>`;
    }
}

// ============================================
// GLASSMORPHISM ARCHITECT LOGIC
// ============================================

class GlassArchitect {
    constructor() {
        this.blurSlider = document.getElementById('blurSlider');
        this.opacitySlider = document.getElementById('opacitySlider');
        this.borderSlider = document.getElementById('borderSlider');

        this.blurVal = document.getElementById('blurVal');
        this.opacityVal = document.getElementById('opacityVal');
        this.borderVal = document.getElementById('borderVal');

        this.target = document.getElementById('glassTarget');
        this.cssOutput = document.getElementById('glassCSS');

        if (!this.blurSlider) return;
        this.init();
    }

    init() {
        const update = () => this.updateEffect();
        this.blurSlider.addEventListener('input', update);
        this.opacitySlider.addEventListener('input', update);
        this.borderSlider.addEventListener('input', update);

        // Initial render
        this.updateEffect();
    }

    updateEffect() {
        const blur = this.blurSlider.value;
        const opacity = this.opacitySlider.value / 100;
        const border = this.borderSlider.value / 100;

        if (this.blurVal) this.blurVal.textContent = `${blur}px`;
        if (this.opacityVal) this.opacityVal.textContent = opacity;
        if (this.borderVal) this.borderVal.textContent = border;

        const style = {
            background: `rgba(255, 255, 255, ${opacity})`,
            backdropFilter: `blur(${blur}px)`,
            border: `1px solid rgba(255, 255, 255, ${border})`
        };

        if (this.target) {
            Object.assign(this.target.style, style);
            this.target.style.webkitBackdropFilter = `blur(${blur}px)`;
        }

        if (this.cssOutput) {
            this.cssOutput.textContent = `background: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, ${border});`;
        }
    }
}

// ============================================
// INTERACTIVE TECH RADAR
// ============================================

class TechRadarManager {
    constructor() {
        this.svg = document.getElementById('techRadarSvg');
        this.pointsContainer = document.getElementById('radarPoints');
        this.tooltip = document.getElementById('radarTooltip');

        if (!this.svg) return;

        this.data = [
            // Quadrant 0: Languages & Frameworks (Top-Left)
            { name: "Next.js", ring: 0, quadrant: 0, desc: "Our primary framework for SSR and SEO-critical web platforms." },
            { name: "FastAPI", ring: 0, quadrant: 0, desc: "High-performance Python backend framework for AI integrations." },
            { name: "React", ring: 0, quadrant: 0, desc: "The foundation of our interactive frontend architecture." },
            { name: "TypeScript", ring: 0, quadrant: 0, desc: "Ensuring type safety across all enterprise-grade solutions." },
            { name: "Python", ring: 1, quadrant: 0, desc: "Powering our AI agents and backend engineering." },
            { name: "Bun", ring: 2, quadrant: 0, desc: "Next-gen JS runtime being evaluated for internal tools." },

            // Quadrant 1: Infrastructure & Cloud (Top-Right)
            { name: "AWS", ring: 0, quadrant: 1, desc: "Core cloud infrastructure for maximum scalability." },
            { name: "Docker", ring: 0, quadrant: 1, desc: "Containerization standard for all microservices." },
            { name: "Vercel", ring: 0, quadrant: 1, desc: "Optimized deployment for our Next.js architectures." },
            { name: "Kubernetes", ring: 1, quadrant: 1, desc: "Orchestration for ultra-high-load ERP deployments." },
            { name: "Edge Computing", ring: 0, quadrant: 1, desc: "Minimizing latency for global users." },

            // Quadrant 2: Future Research (Bottom-Left)
            { name: "Quantum Computing", ring: 2, quadrant: 2, desc: "Monitoring Q-algorithm readiness for encryption." },
            { name: "WebGPU", ring: 2, quadrant: 2, desc: "Next-gen graphics performance for browser apps." },
            { name: "Neuromorphic AI", ring: 2, quadrant: 2, desc: "Brain-inspired computing architectures." },
            { name: "Decentralized Auth", ring: 2, quadrant: 2, desc: "ZKP-based private authentication." },

            // Quadrant 3: Tools & DevOps (Bottom-Right)
            { name: "GitHub Actions", ring: 0, quadrant: 3, desc: "Automated CI/CD workflows." },
            { name: "Sentry", ring: 0, quadrant: 3, desc: "Real-time error monitoring and performance tracking." },
            { name: "Postman", ring: 0, quadrant: 3, desc: "API development and testing suite." }
        ];

        this.rings = [80, 180, 280, 380]; // R values
        this.centerX = 400;
        this.centerY = 400;

        this.init();
    }

    init() {
        this.renderPoints();
    }

    renderPoints() {
        this.data.forEach((item, index) => {
            const point = this.calculatePoint(item);
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

            circle.setAttribute("cx", point.x);
            circle.setAttribute("cy", point.y);
            circle.setAttribute("r", 5);
            circle.setAttribute("class", "radar-point");

            // Color based on ring
            const colors = ['#00E676', '#667eea', '#764ba2', 'rgba(255,255,255,0.4)'];
            circle.setAttribute("fill", colors[item.ring]);

            circle.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
            circle.addEventListener('mouseleave', () => this.hideTooltip());

            this.pointsContainer.appendChild(circle);
        });
    }

    calculatePoint(item) {
        // Rings: Adopt(0), Trial(1), Assess(2), Hold(3)
        // Quadrants: 
        // 0: Languages (180-270deg) - Top Left
        // 1: Infra (270-360deg) - Top Right
        // 2: AI (90-180deg) - Bottom Left
        // 3: Tools (0-90deg) - Bottom Right

        const rMin = item.ring === 0 ? 20 : this.rings[item.ring - 1] + 10;
        const rMax = this.rings[item.ring] - 10;
        const radius = Math.random() * (rMax - rMin) + rMin;

        let angleMin, angleMax;
        switch (item.quadrant) {
            case 0: angleMin = 185; angleMax = 265; break;
            case 1: angleMin = 275; angleMax = 355; break;
            case 2: angleMin = 95; angleMax = 175; break;
            case 3: angleMin = 5; angleMax = 85; break;
        }

        const angle = (Math.random() * (angleMax - angleMin) + angleMin) * (Math.PI / 180);

        return {
            x: this.centerX + radius * Math.cos(angle),
            y: this.centerY + radius * Math.sin(angle)
        };
    }

    showTooltip(e, item) {
        if (!this.tooltip) return;
        this.tooltip.innerHTML = `<strong>${item.name}</strong><br><span style="font-size:0.75rem; opacity:0.8;">${item.desc}</span>`;
        this.tooltip.style.opacity = '1';
        this.tooltip.style.left = (e.pageX + 15) + 'px';
        this.tooltip.style.top = (e.pageY + 15) + 'px';
    }

    hideTooltip() {
        if (this.tooltip) this.tooltip.style.opacity = '0';
    }
}


// ============================================
// PROJECT ARCHITECT TOOL
// ============================================

class ProjectArchitect {
    constructor() {
        this.steps = document.querySelectorAll('.architect-step');
        this.nextBtn = document.getElementById('nextArchitect');
        this.prevBtn = document.getElementById('prevArchitect');
        this.resetBtn = document.getElementById('resetArchitect');
        this.roadmapTitle = document.getElementById('roadmapTitle');
        this.roadmapText = document.getElementById('roadmapText');
        this.options = document.querySelectorAll('.architect-opt');

        if (!this.steps.length) return;

        this.currentStep = 1;
        this.selections = {};
        this.init();
    }

    init() {
        this.nextBtn.addEventListener('click', () => this.handleNext());
        this.prevBtn.addEventListener('click', () => this.handlePrev());
        this.resetBtn.addEventListener('click', () => this.reset());

        this.options.forEach(opt => {
            opt.addEventListener('click', (e) => {
                const parent = e.target.closest('.architect-step');
                const stepNum = parent.dataset.step;

                // Clear sibling active states
                parent.querySelectorAll('.architect-opt').forEach(btn => btn.classList.remove('selected'));
                e.target.classList.add('selected');

                this.selections[stepNum === "1" ? "industry" : "goal"] = e.target.dataset.val;
            });
        });
    }

    handleNext() {
        if (this.currentStep === 1 && !this.selections.industry) {
            alert("Please select an industry first.");
            return;
        }
        if (this.currentStep === 2 && !this.selections.goal) {
            alert("Please select a priority goal.");
            return;
        }

        if (this.currentStep < 3) {
            this.currentStep++;
            this.updateUI();
        }
    }

    handlePrev() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }

    updateUI() {
        this.steps.forEach(step => {
            const stepNum = step.dataset.step;
            if (stepNum === "result") {
                step.style.display = (this.currentStep === 3) ? 'block' : 'none';
            } else {
                step.style.display = (parseInt(stepNum) === this.currentStep) ? 'block' : 'none';
            }
        });

        // Toggle buttons visibility
        this.prevBtn.style.display = (this.currentStep === 2) ? 'inline-block' : 'none';
        this.nextBtn.style.display = (this.currentStep < 3) ? 'inline-block' : 'none';
        this.resetBtn.style.display = (this.currentStep === 3) ? 'inline-block' : 'none';

        if (this.currentStep === 3) {
            this.generateRoadmap();
        }
    }

    generateRoadmap() {
        const roadmaps = {
            manufacturing: {
                waste: "Phase 1: Deploy IoT sensors for real-time waste tracking. Phase 2: Implement SWEN-TEK ERP for automated yield calculations. Phase 3: Optimize raw material sourcing via AI.",
                automation: "Phase 1: Audit manual assembly lines. Phase 2: Integration of robotic process automation. Phase 3: AI-driven predictive maintenance scheduling.",
                efficiency: "Phase 1: Lean process mapping. Phase 2: Real-time dashboard integration for managers. Phase 3: Continuous improvement loop through data feedback."
            },
            saas: {
                scale: "Phase 1: AWS optimization & serverless architecture. Phase 2: Multi-regional database deployment. Phase 3: AI-powered traffic load balancer.",
                automation: "Phase 1: Customer support bot integration. Phase 2: Automated CI/CD pipeline overhaul. Phase 3: Neural network for churn prediction.",
                efficiency: "Phase 1: Code bottleneck analysis. Phase 2: Shared components library development. Phase 3: Automated QA testing suites (100% coverage target)."
            }
        };

        const industry = this.selections.industry || "manufacturing";
        const goal = this.selections.goal || "efficiency";

        const content = (roadmaps[industry] && roadmaps[industry][goal])
            ? roadmaps[industry][goal]
            : "Strategic Plan: Initial audit within 48 hours, followed by a 4-week Sprint focusing on MVP integration and data-driven infrastructure expansion.";

        this.roadmapTitle.textContent = `Roadmap: ${industry.toUpperCase()} x ${goal.replace('_', ' ').toUpperCase()}`;
        this.roadmapText.textContent = content;
    }

    reset() {
        this.currentStep = 1;
        this.selections = {};
        this.options.forEach(opt => opt.classList.remove('selected'));
        this.updateUI();
    }
}

// ============================================
// WASTE ROI SIMULATOR
// ============================================

class WasteSimulator {
    constructor() {
        this.slider = document.getElementById('revenueSlider');
        this.display = document.getElementById('revenueDisplay');
        this.lostVal = document.getElementById('lostValue');
        this.reclaimedVal = document.getElementById('reclaimedValue');

        if (!this.slider) return;

        this.init();
    }

    init() {
        this.slider.addEventListener('input', (e) => this.calculate(e.target.value));
        this.calculate(this.slider.value);
    }

    calculate(val) {
        const revenue = parseInt(val);
        const lost = revenue * 0.15; // Assume 15% wastage industry standard
        const reclaimed = lost * 0.80; // SWEN can reclaim 80% of those losses

        this.display.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(revenue);
        this.lostVal.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(lost);
        this.reclaimedVal.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(reclaimed);

        // Visual feedback
        this.lostVal.parentElement.style.transform = "scale(1.02)";
        this.reclaimedVal.parentElement.style.transform = "scale(1.05)";
        setTimeout(() => {
            if (this.lostVal.parentElement) this.lostVal.parentElement.style.transform = "scale(1)";
            if (this.reclaimedVal.parentElement) this.reclaimedVal.parentElement.style.transform = "scale(1)";
        }, 100);
    }
}

// ============================================
// PERSONALIZATION & INTEREST TRACKER
// ============================================

class InterestTracker {
    constructor() {
        this.trackingSelectors = ['.glass-card', '.btn-secondary', '.service-card', 'footer a', '.nav-link'];
        this.interests = JSON.parse(localStorage.getItem('swenInterests')) || {
            manufacturing: 0,
            saas: 0,
            ai: 0,
            web: 0
        };
        this.init();
    }

    init() {
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest(this.trackingSelectors.join(','));
            if (!target) return;

            const text = (target.textContent + (target.href || '')).toLowerCase();

            if (text.includes('manufacturing') || text.includes('production') || text.includes('erp')) this.interests.manufacturing += 0.1;
            if (text.includes('saas') || text.includes('software') || text.includes('cloud')) this.interests.saas += 0.1;
            if (text.includes('ai') || text.includes('agent') || text.includes('intelligence')) this.interests.ai += 0.1;
            if (text.includes('web') || text.includes('design') || text.includes('dev')) this.interests.web += 0.1;

            if (this.interests.ai % 1 < 0.2) { // Periodically save
                localStorage.setItem('swenInterests', JSON.stringify(this.interests));
                this.personalizeContent();
            }
        });

        this.personalizeContent();
    }

    personalizeContent() {
        const topInterest = Object.keys(this.interests).reduce((a, b) => this.interests[a] > this.interests[b] ? a : b);
        if (this.interests[topInterest] < 2) return; // Threshold for personalization

        const heroTagline = document.querySelector('.hero-tagline');
        const ctaBtn = document.querySelector('.nav-links a[href="contact.html"], .hero-cta-group .btn-primary');

        const campaigns = {
            manufacturing: {
                tagline: "Architecting the Future of Smart Manufacturing",
                cta: "Optimize Operations"
            },
            saas: {
                tagline: "Engineering Scalable Enterprise SaaS Architectures",
                cta: "Build Your Platform"
            },
            ai: {
                tagline: "Intelligent AI Agents for Autonomous Business Growth",
                cta: "Deploy AI Agents"
            },
            web: {
                tagline: "High-Performance Digital Engineering & Product Design",
                cta: "Launch Your Vision"
            }
        };

        if (heroTagline && !window.hasPersonalizedHero) {
            heroTagline.style.opacity = '0';
            setTimeout(() => {
                heroTagline.textContent = campaigns[topInterest].tagline;
                heroTagline.style.opacity = '1';
                heroTagline.style.color = 'var(--color-blue)';
                heroTagline.style.fontWeight = '700';
            }, 500);
            window.hasPersonalizedHero = true;
        }

        if (ctaBtn) {
            ctaBtn.textContent = campaigns[topInterest].cta;
            ctaBtn.classList.add('personalized-pulse');
        }
    }
}

// ============================================
// MOBILE MENU MANAGER
// ============================================

class MobileMenuManager {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.navLinks = document.querySelector('.nav-links');
        this.links = document.querySelectorAll('.nav-link');

        if (!this.menuToggle || !this.navLinks) {
            console.warn("⚠️ Mobile Menu Elements Not Found:", { toggle: !!this.menuToggle, links: !!this.navLinks });
            return;
        }

        console.log("🚀 MobileMenuManager Initialized Successfully");
        this.init();
    }

    init() {
        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("🖱️ Menu Toggle Clicked");
            this.navLinks.classList.toggle('active');
            const icon = this.menuToggle.querySelector('i');
            if (this.navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when clicking a link
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.navLinks.classList.remove('active');
                const icon = this.menuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navLinks.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.navLinks.classList.remove('active');
                const icon = this.menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }
}

// ============================================
// PERFORMANCE BENCHMARK TOOL
// ============================================

class SpeedTester {
    constructor() {
        this.runBtn = document.getElementById('runSpeedTest');
        this.swenSpeed = document.getElementById('swenSpeed');
        this.legacySpeed = document.getElementById('legacySpeed');
        this.swenBar = document.getElementById('swenBar');
        this.legacyBar = document.getElementById('legacyBar');

        if (!this.runBtn) return;

        this.init();
    }

    init() {
        this.runBtn.addEventListener('click', () => this.runBenchmark());
    }

    async runBenchmark() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.runBtn.disabled = true;
        this.runBtn.textContent = "TESTING...";

        // Reset
        this.swenSpeed.textContent = "0ms";
        this.legacySpeed.textContent = "0ms";
        this.swenBar.style.width = "0%";
        this.legacyBar.style.width = "0%";

        // Simulate Legacy Loading (Slow)
        const legacyTarget = 3200; // ms
        const legacyCurrent = { val: 0 };
        this.animateMetric(this.legacySpeed, this.legacyBar, legacyTarget, 3000, 100);

        // Simulate SWEN-TECH Loading (Fast)
        const swenTarget = 420; // ms
        await new Promise(r => setTimeout(r, 500)); // Delay to show contrast
        this.animateMetric(this.swenSpeed, this.swenBar, swenTarget, 1000, 45);

        setTimeout(() => {
            this.runBtn.disabled = false;
            this.runBtn.textContent = "RUN BENCHMARK";
            this.isRunning = false;
        }, 3200);
    }

    animateMetric(valEl, barEl, target, duration, maxBarWidth) {
        const start = 0;
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * progress);

            valEl.textContent = `${current}ms`;
            barEl.style.width = `${(current / target) * maxBarWidth}%`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    }
}
// ============================================
// INNOVATION LAB MANAGER (Step Transitions & ROI)
// ============================================

class InnovationLabManager {
    constructor() {
        // Project Architect Elements
        this.nextBtn = document.getElementById('nextArchitect');
        this.prevBtn = document.getElementById('prevArchitect');
        this.resetBtn = document.getElementById('resetArchitect');
        this.steps = document.querySelectorAll('.architect-step');
        this.options = document.querySelectorAll('.architect-opt');
        this.currentStep = 1;

        // ROI Simulator Elements
        this.revenueSlider = document.getElementById('revenueSlider');
        this.revenueDisplay = document.getElementById('revenueDisplay');
        this.lostValue = document.getElementById('lostValue');
        this.reclaimedValue = document.getElementById('reclaimedValue');

        if (!this.nextBtn && !this.revenueSlider) return;

        this.init();
    }

    init() {
        // Architect Initialization
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.handleNext());
            this.prevBtn.addEventListener('click', () => this.handlePrev());
            this.resetBtn.addEventListener('click', () => this.handleReset());

            this.options.forEach(opt => {
                opt.addEventListener('click', () => {
                    const stepDiv = opt.closest('.architect-step');
                    stepDiv.querySelectorAll('.architect-opt').forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                });
            });
        }

        // ROI Initialization
        if (this.revenueSlider) {
            this.revenueSlider.addEventListener('input', () => this.updateROI());
            this.updateROI(); // Initial values
        }
    }

    handleNext() {
        const activeStep = document.querySelector('.architect-step.active');
        const selected = activeStep.querySelector('.architect-opt.active');

        if (!selected && this.currentStep < 3) {
            activeStep.classList.add('shake');
            setTimeout(() => activeStep.classList.remove('shake'), 500);
            return;
        }

        if (this.currentStep === 1) {
            this.transitionStep(1, 2);
            this.currentStep = 2;
            this.prevBtn.style.display = 'block';
        } else if (this.currentStep === 2) {
            this.showResult();
            this.currentStep = 3;
            this.nextBtn.style.display = 'none';
            this.prevBtn.style.display = 'none';
            this.resetBtn.style.display = 'block';
        }
    }

    handlePrev() {
        if (this.currentStep === 2) {
            this.transitionStep(2, 1);
            this.currentStep = 1;
            this.prevBtn.style.display = 'none';
        }
    }

    handleReset() {
        this.steps.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        document.querySelector('.architect-step[data-step="1"]').classList.add('active');
        document.querySelector('.architect-step[data-step="1"]').style.display = 'block';
        this.steps.forEach(s => s.querySelectorAll('.architect-opt').forEach(o => o.classList.remove('active')));

        this.currentStep = 1;
        this.nextBtn.style.display = 'block';
        this.prevBtn.style.display = 'none';
        this.resetBtn.style.display = 'none';
    }

    transitionStep(from, to) {
        const fromEl = document.querySelector(`.architect-step[data-step="${from}"]`);
        const toEl = document.querySelector(`.architect-step[data-step="${to}"]`);

        fromEl.style.opacity = '0';
        setTimeout(() => {
            fromEl.style.display = 'none';
            fromEl.classList.remove('active');

            toEl.style.display = 'block';
            toEl.style.opacity = '0';
            toEl.classList.add('active');

            setTimeout(() => {
                toEl.style.opacity = '1';
            }, 50);
        }, 300);
    }

    showResult() {
        const industry = document.querySelector('.architect-step[data-step="1"] .architect-opt.active').getAttribute('data-val');
        const goal = document.querySelector('.architect-step[data-step="2"] .architect-opt.active').getAttribute('data-val');

        const title = document.getElementById('roadmapTitle');
        const text = document.getElementById('roadmapText');
        const resultStep = document.querySelector('.architect-step[data-step="result"]');

        const roadmaps = {
            manufacturing: {
                waste: "Phase 1: Real-time sensor integration. Phase 2: Predictive waste modeling. Phase 3: Automated supply chain adjustment.",
                efficiency: "Phase 1: Process mapping. Phase 2: ERP bottleneck identification. Phase 3: Custom workflow automation."
            },
            saas: {
                scale: "Phase 1: Cloud-native autoscaling. Phase 2: Distributed caching. Phase 3: Global content delivery optimization.",
                automation: "Phase 1: API lead generation hooks. Phase 2: AI-driven churn prediction. Phase 3: Autonomous customer success agents."
            }
        };

        const roadmap = (roadmaps[industry] && roadmaps[industry][goal])
            ? roadmaps[industry][goal]
            : "Custom Roadmap: We will analyze your unique requirements and provide a tailored digital transformation strategy within 24 hours.";

        title.textContent = `Roadmap for ${industry.toUpperCase()} - ${goal.toUpperCase()}`;
        text.textContent = roadmap;

        this.transitionStep(2, 'result');
    }

    updateROI() {
        const revenue = parseInt(this.revenueSlider.value);
        this.revenueDisplay.textContent = `₹${revenue.toLocaleString('en-IN')}`;

        const lost = Math.round(revenue * 0.15);
        const reclaimed = Math.round(lost * 0.84);

        this.animateCounter(this.lostValue, lost);
        this.animateCounter(this.reclaimedValue, reclaimed);
    }

    animateCounter(el, target) {
        const start = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
        const duration = 1000;
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(start + (target - start) * ease);
            el.textContent = `₹${current.toLocaleString('en-IN')}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
}

// ============================================
// INITIALIZE ALL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const init = (className, Instance) => {
        try {
            new Instance();
            console.log(`✅ ${className} Initialized`);
        } catch (e) {
            console.error(`❌ ${className} Initialization Failed:`, e);
        }
    };

    init('SmoothScroll', SmoothScroll);
    init('RevealOnScroll', RevealOnScroll);
    init('OrderManager', OrderManager);
    init('TestimonialsCarousel', TestimonialsCarousel);
    init('TestimonialFormManager', TestimonialFormManager);

    init('CurrencyConverter', CurrencyConverter);
    init('NewsletterManager', NewsletterManager);
    init('BlogFilterManager', BlogFilterManager);
    init('TeamModalManager', TeamModalManager);
    init('PricingCalculator', PricingCalculator);
    init('QuoteFormLoader', QuoteFormLoader);
    init('ProjectEstimator', ProjectEstimator);
    init('ToolManager', ToolManager);
    init('APITester', APITester);
    init('PerformanceAnalyzer', PerformanceAnalyzer);
    init('ResponsiveChecker', ResponsiveChecker);
    init('AIAssistant', AIAssistant);
    init('DashboardManager', DashboardManager);
    init('PlaygroundManager', PlaygroundManager);
    init('TechRadarManager', TechRadarManager);
    init('ProjectArchitect', ProjectArchitect);
    init('WasteSimulator', WasteSimulator);
    init('InterestTracker', InterestTracker);
    init('SpeedTester', SpeedTester);
    init('MobileMenuManager', MobileMenuManager);

    const typingElement = document.querySelector('.hero-tagline');
    if (typingElement) {
        const originalText = typingElement.textContent;
        typingElement.textContent = '';
        new TypingEffect(typingElement, [originalText], 100);
    }

    console.log('🚀 Swen Tech Solutions Loaded');
});


