class BlogAnimation {
    constructor() {
        this.startAnimation();
    }

    startAnimation() {
        this.hideContent();
        this.revealContent();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupToggleFiltro();  // Aquí agregamos el nuevo listener
    }

    hideContent() {
        const elements = document.body.children;
        Array.from(elements).forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = 'none';
        });
    }

    revealContent() {
        const mainElements = ['.barra-superior', '.barra-navegacion', '.section1'];
        
        mainElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });

        setTimeout(() => {
            const allElements = document.body.children;
            Array.from(allElements).forEach((child, index) => {
                if (child.style.opacity === '0') {
                    setTimeout(() => {
                        child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, 800);
    }

    setupScrollAnimations() {
        const sections = ['.section2', '.section3', '.section4', '.section5', '.section6'];
        
        sections.forEach(selector => {
            const section = document.querySelector(selector);
            if (!section) return;

            section.style.opacity = '0';
            section.style.transform = 'translateY(40px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(section);
        });

        this.setupSection3Animation();
        this.setupSection4Animation();
        this.setupSection5Animation();
    }

    setupSection3Animation() {
        const section3 = document.querySelector('.section3');
        if (!section3) return;

        const imageDiv = section3.querySelector('.section3-div1');
        const contentDiv = section3.querySelector('.section3-div2');

        if (imageDiv && contentDiv) {
            imageDiv.style.opacity = '0';
            imageDiv.style.transform = 'translateX(-50px)';
            contentDiv.style.opacity = '0';
            contentDiv.style.transform = 'translateX(50px)';

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            imageDiv.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            imageDiv.style.opacity = '1';
                            image.style.transform = 'translateX(0)';
                        }, 200);

                        setTimeout(() => {
                            contentDiv.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            contentDiv.style.opacity = '1';
                            contentDiv.style.transform = 'translateX(0)';
                        }, 400);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(section3);
        }
    }

    setupSection4Animation() {
        const section4Elements = document.querySelectorAll('.section4');
        
        section4Elements.forEach(section => {
            const cards = section.querySelectorAll('.exercise-card, .stress-card');
            
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1) translateY(0)';
                            }, index * 200);
                        });
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(section);
        });
    }

    setupSection5Animation() {
        const section5 = document.querySelector('.section5');
        if (!section5) return;

        const contentDiv = section5.querySelector('.section5-div1');
        const imageDiv = section5.querySelector('.section5-div2');

        if (contentDiv && imageDiv) {
            contentDiv.style.opacity = '0';
            contentDiv.style.transform = 'translateX(-50px)';
            imageDiv.style.opacity = '0';
            imageDiv.style.transform = 'translateX(50px)';

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            imageDiv.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
                            imageDiv.style.opacity = '1';
                            imageDiv.style.transform = 'translateX(0)';
                        }, 300);

                        setTimeout(() => {
                            contentDiv.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
                            contentDiv.style.opacity = '1';
                            contentDiv.style.transform = 'translateX(0)';
                        }, 600);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(section5);
        }
    }

    setupHoverEffects() {
        const cards = document.querySelectorAll('.exercise-card, .stress-card');
        cards.forEach(card => {
            card.style.transition = 'transform 1s ease, box-shadow 1s ease';
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });

        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.transition = 'transform 1s ease';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    }

    setupToggleFiltro() {
        const toggle = document.getElementById('toggleFiltro');
        if (!toggle) {
            console.warn('El elemento toggleFiltro no existe en el DOM.');
            return;
        }

        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                console.log('Modo avanzado activado');
            } else {
                console.log('Modo avanzado desactivado');
            }
        });
    }
}

// Global Translation and Language Menu Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize BlogAnimation first
    const blogAnimation = new BlogAnimation();

    // Setup language dropdown
    setupLanguageDropdown();

    function setupLanguageDropdown() {
        const languageDropdownDiv = document.querySelector('.language-dropdown');
        let languageButton = null;
        let languageMenu = null;
        let dropdownItems = null;

        if (languageDropdownDiv) {
            languageButton = languageDropdownDiv.querySelector('.boton-idioma');
            languageMenu = languageDropdownDiv.querySelector('.dropdown-menu');
            dropdownItems = languageDropdownDiv.querySelectorAll('.dropdown-item');

            if (languageButton && languageMenu && dropdownItems.length > 0) {
                languageButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    languageMenu.classList.toggle('show');
                });
                
                document.addEventListener('click', function(e) {
                    if (!languageDropdownDiv.contains(e.target)) {
                        languageMenu.classList.remove('show');
                    }
                });
                
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        languageMenu.classList.remove('show');
                    }
                });
                
                dropdownItems.forEach(item => {
                    item.addEventListener('click', function(e) {
                        e.preventDefault();
                        const selectedLang = this.getAttribute('data-lang');
                        
                        console.log('Selected language:', selectedLang);
                        
                        languageMenu.classList.remove('show');
                        
                        changeLanguage(selectedLang);
                        
                        localStorage.setItem('selectedLanguage', selectedLang);
                    });
                });
            } else {
                console.warn("Language dropdown elements not found, translation functionality will not be fully initialized.");
            }
        }
    }


    function changeLanguage(lang) {
        const translations = {
            es: {
                // Page Title
                pageTitle: 'Blog de Salud',
                
                // Top bar and navigation
                searchPlaceholder: 'Buscar',
                registerButton: 'Registrarse',
                loginButton: 'Iniciar Sesión',
                homeNav: 'Inicio',
                featuresNav: 'Funcionalidades y Beneficios',
                aboutNav: 'Acerca de Nosotros',
                blogNav: 'Blog',
                profileLink: 'Perfil',
                logoutLink: 'Cerrar sesión',

                // Blog Main Content
                blog_main_image: 'blog_principal_esp.webp',
                section2_h2: 'Toma el control de tu salud con información sencilla y fiable',
                section2_p: 'Nuestro blog ofrece artículos útiles y actualizados solo para ti, cubriendo desde consejos para dormir mejor hasta guías prácticas sobre nutrición, bienestar mental y más. ¡Tu bienestar comienza con estar bien informado!',
                
                sleep_image: 'blog_uno_esp.webp',
                sleep_h2: 'Beneficios del sueño para la salud',
                sleep_p1: 'Dormir bien es esencial para nuestra salud y bienestar emocional.',
                sleep_p2: 'Dormir lo suficiente y tener un sueño de buena calidad son esenciales para un sueño saludable.',
                sleep_p3: 'La cantidad de sueño que necesitas cambia a medida que envejeces.',
                sleep_p4: 'Habla con tu proveedor de atención médica si tienes problemas para dormir.',

                exercise_image: 'blog_dos_esp.webp',
                exercise_h2: 'Beneficios del Ejercicio',

                stress_image: 'blog_tres_esp.webp',
                stress_h2: 'Manejo del Estrés',

                preventive_care_h2: 'La importancia de la atención preventiva',
                preventive_care_p1: 'La atención preventiva es un enfoque de salud integral que tiene como objetivo garantizar el bienestar de las personas a lo largo de toda su vida, desde la promoción de la salud y la prevención de enfermedades hasta el tratamiento, la rehabilitación y los cuidados paliativos.',
                preventive_care_p2: 'Su propósito es asegurar una distribución equitativa de la salud, brindando una atención centrada en las necesidades de las personas lo más cerca posible de su entorno cotidiano.',
                preventive_care_image: 'blog_cuatro_esp.webp',

                selfmedication_image: 'blog_cinco_esp.webp',
                selfmedication_h2: 'Automedicación: Riesgos y Conciencia',

                lifestyle_image: 'blog_seis_esp.webp',
                lifestyle_h2: 'Factores del Estilo de Vida en la Salud',
                
                section6_p: 'Estamos preparando una serie de nuevos artículos para nuestro blog de salud, llenos de consejos prácticos, opiniones de expertos e información fiable para apoyar tu bienestar. Ya sea que te interese la nutrición, la salud mental, el ejercicio o los hábitos saludables, habrá algo valioso para ti.',
                section6_strong: 'Mantente atento — ¡tu camino hacia una mejor salud continúa aquí!',

                // Footer (common, maintained for completeness)
                footer_h3: 'Health<br>Connectors', 
                footer_p1: 'New Elsiebury',
                footer_p2: '634 Halvorson',
                footer_p3: 'Estates Suite 039',
                footer_button: 'saber más',
                footer_links_h3: 'Enlaces',
                footer_link_home: 'Inicio',
                footer_link_pages: 'Páginas',
                footer_link_services: 'Servicios',
                footer_link_portfolio: 'Portafolio',
                footer_link_blog: 'Blog',
                footer_link_contact: 'Contacto',
                footer_link_privacy: 'Políticas de privacidad',
                footer_link_terms: 'Términos de uso',
                footer_link_signup: 'Registrarse',
                footer_link_login: 'Iniciar sesión',
                footer_link_defamation: 'Difamación',
                footer_recent_posts_h3: 'Publicaciones recientes',
                recent_post_sleep: 'Beneficios del sueño para la salud',
                recent_post_exercise: 'Beneficios del ejercicio',
                recent_post_stress: 'Manejo del estrés',
                recent_post_preventive_care: 'La importancia de la atención preventiva.',
            },
            en: {
                // Page Title
                pageTitle: 'Health Blog',
                
                // Top bar and navigation
                searchPlaceholder: 'Search',
                registerButton: 'Register',
                loginButton: 'Login',
                homeNav: 'Home',
                featuresNav: 'Functions and Benefits',
                aboutNav: 'About us',
                blogNav: 'Blog',
                profileLink: 'Profile',
                logoutLink: 'Logout',

                // Blog Main Content
                blog_main_image: 'principalblog.webp',
                section2_h2: 'Take charge of your health with simple, reliable information',
                section2_p: 'Our blog offers helpful, up-to-date articles just for you—covering everything from better sleep tips to practical guides on nutrition, mental well-being, and more. Your wellness starts with being well-informed!',
                
                sleep_image: 'sleep.webp',
                sleep_h2: 'Health Benefits of Sleep',
                sleep_p1: 'Sleeping well is essential for our health and emotional well-being.',
                sleep_p2: 'Getting enough sleep and having good quality sleep are essential for healthy sleep.',
                sleep_p3: 'The amount of sleep you need changes as you age.',
                sleep_p4: 'Talk to your healthcare provider if you have trouble sleeping.',

                exercise_image: 'excercise.webp',
                exercise_h2: 'Benefits of Exercise',

                stress_image: 'stress.webp',
                stress_h2: 'Stress Management',

                preventive_care_h2: 'The importance of the preventive care',
                preventive_care_p1: 'Preventive care is a comprehensive health approach that aims to guarantee the well-being of individuals throughout their entire life, from health promotion and disease prevention to treatment, rehabilitation, and palliative care.',
                preventive_care_p2: 'Its purpose is to ensure an equitable distribution of health, providing care centered on the needs of individuals as close as possible to their everyday environment.',
                preventive_care_image: 'prevention.webp',

                selfmedication_image: 'selfmedication.webp',
                selfmedication_h2: 'Self-Medication: Risks and Awareness',

                lifestyle_image: 'lifestyle_factors.webp',
                lifestyle_h2: 'Lifestyle Factors in Health',

                section6_p: 'We’re preparing a series of new articles for our health blog, filled with practical tips, expert insights, and reliable information to support your well-being. Whether you’re interested in nutrition, mental health, exercise, or healthy habits, there will be something valuable for you.',
                section6_strong: 'Stay tuned — your journey to better health continues here!',

                // Footer (common, maintained for completeness)
                footer_h3: 'Health<br />Connectors',
                footer_p1: 'New Elsiebury',
                footer_p2: '634 Halvorson',
                footer_p3: 'Estates Suite 039',
                footer_button: 'know more',
                footer_links_h3: 'Links',
                footer_link_home: 'Home',
                footer_link_pages: 'Pages',
                footer_link_services: 'Services',
                footer_link_portfolio: 'Portfolio',
                footer_link_blog: 'Blog',
                footer_link_contact: 'Contact',
                footer_link_privacy: 'Privacy policies',
                footer_link_terms: 'Terms of use',
                footer_link_signup: 'Sign up',
                footer_link_login: 'Login',
                footer_link_defamation: 'Defamation',
                footer_recent_posts_h3: 'Recent posts',
                recent_post_sleep: 'Health Benefits of Sleep',
                recent_post_exercise: 'Benefits of Excercise',
                recent_post_stress: 'Stress Management',
                recent_post_preventive_care: 'The importance of preventive care.',
            }
        };
        
        const texts = translations[lang];
        
        if (texts) {
            // Translate page title
            const pageTitleElement = document.querySelector('title[data-text-key="pageTitle"]');
            if (pageTitleElement) pageTitleElement.textContent = texts.pageTitle;

            // Change search placeholder
            const searchInput = document.querySelector('input[data-text-key="searchPlaceholder"]');
            if (searchInput) searchInput.placeholder = texts.searchPlaceholder;

            // Handle login/register buttons or "My Account" dropdown
            const registerButton = document.querySelector('button[data-text-key="registerButton"]');
            if (registerButton) registerButton.textContent = texts.registerButton;

            const loginButton = document.querySelector('button[data-text-key="loginButton"]');
            if (loginButton) loginButton.textContent = texts.loginButton;

            const profileLink = document.querySelector('a[data-text-key="profileLink"]');
            if (profileLink) profileLink.textContent = texts.profileLink;

            const logoutLink = document.querySelector('a[data-text-key="logoutLink"]');
            if (logoutLink) logoutLink.textContent = texts.logoutLink;

            // Main navigation
            document.querySelectorAll('nav ul li a[data-nav-key]').forEach(link => {
                const key = link.getAttribute('data-nav-key');
                if (key && texts[key]) link.textContent = texts[key];
            });

            // --- Blog specific content ---
            const blogMainImage = document.querySelector('img[data-image-key="blog_main_image"]');
            if (blogMainImage) blogMainImage.src = `/static/images/${texts.blog_main_image}`;

            const section2H2 = document.querySelector('h2[data-text-key="section2_h2"]');
            if (section2H2) section2H2.textContent = texts.section2_h2;
            const section2P = document.querySelector('p[data-text-key="section2_p"]');
            if (section2P) section2P.textContent = texts.section2_p;

            const sleepImage = document.querySelector('img[data-image-key="sleep_image"]');
            if (sleepImage) sleepImage.src = `/static/images/${texts.sleep_image}`;
            const sleepH2 = document.querySelector('h2[data-text-key="sleep_h2"]');
            if (sleepH2) sleepH2.textContent = texts.sleep_h2;
            const sleepP1 = document.querySelector('p[data-text-key="sleep_p1"]');
            if (sleepP1) sleepP1.textContent = texts.sleep_p1;
            const sleepP2 = document.querySelector('p[data-text-key="sleep_p2"]');
            if (sleepP2) sleepP2.textContent = texts.sleep_p2;
            const sleepP3 = document.querySelector('p[data-text-key="sleep_p3"]');
            if (sleepP3) sleepP3.textContent = texts.sleep_p3;
            const sleepP4 = document.querySelector('p[data-text-key="sleep_p4"]');
            if (sleepP4) sleepP4.textContent = texts.sleep_p4;

            const exerciseImage = document.querySelector('img[data-image-key="exercise_image"]');
            if (exerciseImage) exerciseImage.src = `/static/images/${texts.exercise_image}`;
            const exerciseH2 = document.querySelector('h2[data-text-key="exercise_h2"]');
            if (exerciseH2) exerciseH2.textContent = texts.exercise_h2;

            const stressImage = document.querySelector('img[data-image-key="stress_image"]');
            if (stressImage) stressImage.src = `/static/images/${texts.stress_image}`;
            const stressH2 = document.querySelector('h2[data-text-key="stress_h2"]');
            if (stressH2) stressH2.textContent = texts.stress_h2;

            const preventiveCareH2 = document.querySelector('h2[data-text-key="preventive_care_h2"]');
            if (preventiveCareH2) preventiveCareH2.textContent = texts.preventive_care_h2;
            const preventiveCareP1 = document.querySelector('p[data-text-key="preventive_care_p1"]');
            if (preventiveCareP1) preventiveCareP1.textContent = texts.preventive_care_p1;
            const preventiveCareP2 = document.querySelector('p[data-text-key="preventive_care_p2"]');
            if (preventiveCareP2) preventiveCareP2.textContent = texts.preventive_care_p2;
            const preventionImage = document.querySelector('img[data-image-key="prevention_image"]');
            if (preventionImage) preventionImage.src = `/static/images/${texts.preventive_care_image}`;

            const selfmedicationImage = document.querySelector('img[data-image-key="selfmedication_image"]');
            if (selfmedicationImage) selfmedicationImage.src = `/static/images/${texts.selfmedication_image}`;
            const selfmedicationH2 = document.querySelector('h2[data-text-key="selfmedication_h2"]');
            if (selfmedicationH2) selfmedicationH2.textContent = texts.selfmedication_h2;

            const lifestyleImage = document.querySelector('img[data-image-key="lifestyle_image"]');
            if (lifestyleImage) lifestyleImage.src = `/static/images/${texts.lifestyle_image}`;
            const lifestyleH2 = document.querySelector('h2[data-text-key="lifestyle_h2"]');
            if (lifestyleH2) lifestyleH2.textContent = texts.lifestyle_h2;


            const section6P = document.querySelector('p[data-text-key="section6_p"]');
            if (section6P) section6P.textContent = texts.section6_p;
            const section6Strong = document.querySelector('strong[data-text-key="section6_strong"]');
            if (section6Strong) section6Strong.textContent = texts.section6_strong;


            // --- Footer (common, maintained for completeness) ---
            const footerH3 = document.querySelector('footer .footer-column h3[data-text-key="footer_h3"]');
            if (footerH3) footerH3.innerHTML = texts.footer_h3.replace('<br />', '<br>');
            
            const footerP1 = document.querySelector('footer .footer-column p[data-text-key="footer_p1"]');
            if (footerP1) footerP1.textContent = texts.footer_p1;
            const footerP2 = document.querySelector('footer .footer-column p[data-text-key="footer_p2"]');
            if (footerP2) footerP2.textContent = texts.footer_p2;
            const footerP3 = document.querySelector('footer .footer-column p[data-text-key="footer_p3"]');
            if (footerP3) footerP3.textContent = texts.footer_p3;
            
            const footerButton = document.querySelector('footer .social-button button[data-text-key="footer_button"]');
            if (footerButton) footerButton.textContent = texts.footer_button;

            const footerLinksH3 = document.querySelector('footer .links-column h3[data-text-key="footer_links_h3"]');
            if (footerLinksH3) footerLinksH3.textContent = texts.footer_links_h3;
            
            document.querySelectorAll('footer .links-column ul.footer-links:first-of-type li a[data-text-key]').forEach(link => {
                const key = link.getAttribute('data-text-key');
                if (key && texts[key]) link.textContent = texts[key];
            });
            document.querySelectorAll('footer .links-column ul.footer-links:nth-of-type(2) li a[data-text-key]').forEach(link => {
                const key = link.getAttribute('data-text-key');
                if (key && texts[key]) link.textContent = texts[key];
            });

            const footerRecentPostsH3 = document.querySelector('footer .recent-posts-column h3[data-text-key="footer_recent_posts_h3"]');
            if (footerRecentPostsH3) footerRecentPostsH3.textContent = texts.footer_recent_posts_h3;
            
            document.querySelectorAll('footer .recent-posts ul li[data-text-key]').forEach(li => {
                const link = li.querySelector('a');
                const key = li.getAttribute('data-text-key');
                if (link && texts[key]) link.textContent = texts[key];
            });

            document.documentElement.lang = lang;
        }
    }

    // Initial language load
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        changeLanguage(savedLanguage);
    } else {
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
        changeLanguage(detectedLang);
    }
});

//FOOTER
class FooterAnimator {
    constructor() {
        this.footer = document.querySelector('.main-footer');
        if (this.footer) {
            this.init();
        }
    }
 
    init() {
        this.prepareFooter();
        this.animateFooter();
    }
 
    prepareFooter() {
        this.footer.style.opacity = '0';
        this.footer.style.transform = 'translateY(40px)';
        this.footer.style.transition = 'transform 0.7s ease-out, opacity 0.7s ease-out';
    }
 
    animateFooter() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        });
 
        observer.observe(this.footer);
    }
 
    animateElement(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
        });
       
        // Animar los elementos de lista
        this.animateListItems(element);
    }
 
    animateListItems(element) {
        const ulItems = element.querySelectorAll('ul li');
        if (ulItems.length > 0) {
            this.staggerAnimate(ulItems, 150, 'translateY(20px)');
        }
    }
 
    staggerAnimate(items, delay, initialTransform) {
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = initialTransform;
            item.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            setTimeout(() => {
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translate(0, 0)';
                });
            }, index * delay + 300);
        });
    }
}
 
// Inicializar el animador del footer
document.addEventListener('DOMContentLoaded', () => {
    new FooterAnimator();
});


