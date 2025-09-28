class SimplePageAnimation {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startAnimation());
        } else {
            this.startAnimation();
        }
    }

    startAnimation() {
        this.hideContent();
        this.revealContent();
        this.initSwiper(); // Swiper initialization moved here
        this.initTroubleSection();
        this.initContactAnimation();

        this.setupImagenPrincipalObserver();
        this.setupManchasScrollObserver();
        this.setupHeathConnectorsManchaObserver();
        this.setupTroubleScrollObserver();
        this.setupSecondCarouselAnimation();
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
        const mainElements = [
            '.barra-superior',
            '.barra-navegacion', 
            '.Imagen_principal',
            '.Heath_connectors_mancha'
        ];

        mainElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 250);
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
                    }, index * 80);
                }
            });
        }, 1000);
    }

    // Animation for the contact section
    initContactAnimation() {
        const contactContainer = document.querySelector('.contact-container');
        if (!contactContainer) return;

        // Hide elements initially
        const formElements = contactContainer.querySelectorAll('.container-left > *');
        const contactImage = contactContainer.querySelector('.container-right img');

        formElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        if (contactImage) {
            contactImage.style.opacity = '0';
            contactImage.style.transform = 'translateX(30px)';
            contactImage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }

        // Set up the intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate form elements in sequence
                    formElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateX(0)';
                        }, index * 150);
                    });

                    // Animate image
                    if (contactImage) {
                        setTimeout(() => {
                            contactImage.style.opacity = '1';
                            contactImage.style.transform = 'translateX(0)';
                        }, formElements.length * 150);
                    }
                }
            });
        }, { threshold: 0.2 });

        observer.observe(contactContainer);

        // Hover effects for inputs
        const inputs = contactContainer.querySelectorAll('.inputs-class');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
            });

            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
                input.style.boxShadow = 'none';
            });
        });

        // Effects for the button
        const submitBtn = contactContainer.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('mouseenter', () => {
                submitBtn.style.transform = 'translateY(-3px)';
                submitBtn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            });

            submitBtn.addEventListener('mouseleave', () => {
                submitBtn.style.transform = 'translateY(0)';
                submitBtn.style.boxShadow = 'none';
            });
        }
    }

    setupImagenPrincipalObserver() {
        const imagen = document.querySelector('.Imagen_principal');
        if (!imagen) {
            console.log('No se encontró .Imagen_principal');
            return;
        }

        let animated = false;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    imagen.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                    imagen.style.opacity = '1';
                    imagen.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(imagen);
    }

    setupManchasScrollObserver() {
        const manchaIzq = document.querySelector('.mancha_izquierda');
        const manchaDer = document.querySelector('.Mancha_derecha');

        if (!manchaIzq || !manchaDer) {
            console.log('No se encontraron las manchas');
            return;
        }

        manchaIzq.style.opacity = '0';
        manchaIzq.style.transform = 'translateX(-50px)';
        manchaIzq.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

        manchaDer.style.opacity = '0';
        manchaDer.style.transform = 'translateX(50px)';
        manchaDer.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    manchaIzq.style.opacity = '1';
                    manchaIzq.style.transform = 'translateX(0)';
                    manchaDer.style.opacity = '1';
                    manchaDer.style.transform = 'translateX(0)';
                } else {
                    manchaIzq.style.opacity = '0';
                    manchaIzq.style.transform = 'translateX(-50px)';
                    manchaDer.style.opacity = '0';
                    manchaDer.style.transform = 'translateX(50px)';
                }
            });
        }, { threshold: 0 });

        const container = document.querySelector('.Imagen_principal') || document.body;
        observer.observe(container);
    }

    setupHeathConnectorsManchaObserver() {
        const manchaSection = document.querySelector('.Heath_connectors_mancha');
        if (!manchaSection) return;

        manchaSection.style.opacity = '0';
        manchaSection.style.transform = 'translateY(30px)';
        manchaSection.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    manchaSection.style.opacity = '1';
                    manchaSection.style.transform = 'translateY(0)';
                } else {
                    manchaSection.style.opacity = '0';
                    manchaSection.style.transform = 'translateY(30px)';
                }
            });
        }, { threshold: 0.2 });

        observer.observe(manchaSection);
    }

    setupSecondCarouselAnimation() {
        const container = document.querySelector('.container2');
        if (!container) return;

        const cards = container.querySelectorAll('.card');

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'none';
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cards.forEach((card, i) => {
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, i * 200);
                    });
                } else {
                    cards.forEach(card => {
                        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                    });
                }
            });
        }, { threshold: 0.2 });

        observer.observe(container);
    }

    initTroubleSection() {
        const troubleSection = document.querySelector('.trouble');
        if (!troubleSection) return;
        // Image WITHOUT animation is handled by CSS or directly in HTML
        const img = troubleSection.querySelector('.trouble_derecha img');
        if (img) {
            // No specific JS animation needed for the image as it's part of the parent section animation.
        }
    }


    setupTroubleScrollObserver() {
        const troubleSection = document.querySelector('.trouble');
        if (!troubleSection) return;

        troubleSection.style.opacity = '0';
        troubleSection.style.transform = 'translateY(30px)';
        troubleSection.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    troubleSection.style.opacity = '1';
                    troubleSection.style.transform = 'translateY(0)';
                } else {
                    troubleSection.style.opacity = '0';
                    troubleSection.style.transform = 'translateY(30px)';
                }
            });
        }, { threshold: 0.2 });

        observer.observe(troubleSection);
    }

    initSwiper() {
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper.js no está cargado.');
            return;
        }

        const swiperContainer = document.querySelector('.mySwiper');
        if (!swiperContainer) {
            console.warn('No se encontró el contenedor .mySwiper');
            return;
        }

        this.swiper = new Swiper('.mySwiper', {
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            },
        });
    }
}

// Global Translation and Language Menu Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize SimplePageAnimation first
    const pageAnimation = new SimplePageAnimation();

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
                pageTitle: 'Health Connectors',
                
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

                // Main content specific to welcome.html
                home_main_header_image: 'Home_encabezado_esp.webp', // Assuming ES version
                health_connectors_h1: 'Health<br><b>Connectors</b>',
                health_connectors_p1: 'Health Connectors es una plataforma digital diseñada para hacer la atención médica más accesible y eficiente. Desde la comodidad de tu hogar, puedes reservar fácilmente citas médicas y encontrar médicos en una amplia gama de especialidades.',
                health_connectors_p2: 'Nuestra plataforma simplifica el proceso de conectar con proveedores médicos, ofreciendo una experiencia rápida, segura y fácil de usar.',
                find_doctor_button_main: 'Encontrar un doctor',

                featured_services_title: 'Servicios destacados',
                service1_image: 'home_offer1_esp.webp',
                service1_title: 'Organización desde casa',
                service1_description: 'Administra tus tareas y tiempo desde la comodidad de tu hogar con herramientas efectivas.',
                service2_image: 'home_offer2_esp.webp',
                service2_title: 'Agenda médica automatizada',
                service2_description: 'Solicita y organiza tus citas médicas sin complicaciones a través de nuestro sistema inteligente.',
                service3_image: 'home_offer3_esp.webp',
                service3_title: 'Agenda en segundos',
                service3_description: 'Realiza todas tus citas con tan solo un par de clics.',
                service4_image: 'home_offer4_esp.webp',
                service4_title: 'Citas más rápidas', // Placeholder
                service4_description: 'Despídete de las largas esperas. Con Health Connectors puedes agendar citas médicas de forma rápida, sencilla y desde cualquier lugar. Consulta la disponibilidad en tiempo real y elige el horario que mejor se ajuste a ti.', // Placeholder
                service5_image: 'home_offer5_esp.webp', // Assuming same image for ES
                service5_title: 'Acceso conectado a tu salud', // Placeholder
                service5_description: 'Tu salud, siempre conectada. Accede a tu historial médico, información importante y artículos confiables desde nuestro journal.', // Placeholder

                trouble_h3: '¿Tienes problemas con tu atención médica?',
                contact_doctor_trouble_button: 'Contactar a un doctor',
                trouble_image: 'home_tercera.webp', // Assuming same image for ES

                journal_title: 'Visita nuestra revista para algunos <br> consejos',
                journal_description: 'Health Connectors también investiga diferentes temas en el campo médico — ¡descubre algunos de ellos!',
                journal_card1_image: 'home_journal.webp', // Assuming same image for ES
                journal_card1_title: 'Consulta a un profesional',
                journal_card1_description: 'Consultar a un profesional médico es importante porque brindan orientación experta, diagnósticos precisos y tratamientos personalizados, lo que garantiza que recibas la mejor atención y mejores resultados de salud.',
                journal_card2_image: 'home_journal1.webp', // Assuming same image for ES
                journal_card2_title: 'Mantente saludable',
                journal_card2_description: 'Mantenerse saludable es crucial porque mejora la calidad de vida, previene enfermedades y aumenta el bienestar general, lo que te permite vivir plena y eficazmente.',
                journal_card3_image: 'home_journal2.webp', // Assuming same image for ES
                journal_card3_title: 'Autocuidado físico',
                journal_card3_description: 'El autocuidado físico es importante porque ayuda a mantener la salud de tu cuerpo, aumenta la energía y previene enfermedades, lo que te permite funcionar de manera óptima en la vida diaria.',

                home_penultima_image: 'functions_dos_esp.webp', // Assuming ES version

                testimonial_h3: 'Testimonio <span data-text-key="testimonial_span">de nuestros usuarios</span>',
                testimonial_span: 'de nuestros usuarios', // The span text needs its own key
                testimonial_blockquote: '"Tu experiencia puede ayudar a otros. Comparte tu historia y sé parte del cambio."',

                contact_h2: '<span id="color-container" data-text-key="contact_span1"> Ponte en</span> <span class="get-touch" data-text-key="contact_span2"> contacto</span>',
                contact_span1: 'Ponte en',
                contact_span2: 'contacto',
                contact_name_placeholder: 'Tu nombre',
                contact_email_placeholder: 'Tu correo electrónico',
                contact_message_placeholder: 'Tu mensaje',
                contact_submit_button: 'Enviar',
                contact_image: 'tipo-get-in-touch.webp', // Assuming same image for ES

                // Footer (common across pages)
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
                pageTitle: 'Health Connectors',
                
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

                // Main content specific to welcome.html
                home_main_header_image: 'home_encabezado_eng.webp',
                health_connectors_h1: 'Health<br /><b>Connectors</b>',
                health_connectors_p1: 'Health Connectors is a digital platform designed to make healthcare more accessible and efficient. From the comfort of your home, you can easily book medical appointments and find doctors across a wide range of specialties.',
                health_connectors_p2: 'Our platform simplifies the process of connecting with medical providers by offering a fast, secure, and user-friendly experience.',
                find_doctor_button_main: 'Find a Doctor',

                featured_services_title: 'Featured Services',
                service1_image: 'home_offer1_eng.webp',
                service1_title: 'Organization from home',
                service1_description: 'Manage your tasks and time from the comfort of your home with effective tools.',
                service2_image: 'home_offer2_eng.webp',
                service2_title: 'Automated medical agenda',
                service2_description: 'Request and organize your medical appointments easily through our smart system.',
                service3_image: 'home_offer3_eng.webp',
                service3_title: 'Schedule in seconds',
                service3_description: 'Make all your appointments with just a couple of clicks.',
                service4_image: 'home_offer4_eng.webp',
                service4_title: 'Faster appointments', // Placeholder
                service4_description: 'Say goodbye to long waits. With Health Connectors, you can book medical appointments quickly, easily, and from anywhere. See real-time availability and choose the time that works best for you.', // Placeholder
                service5_image: 'offer5.webp',
                service5_title: 'Connected health access', // Placeholder
                service5_description: 'Your health, always connected. Access your medical history, important health information, and reliable articles from our journal.', // Placeholder

                trouble_h3: 'Are you having some problems with your healthcare?',
                contact_doctor_trouble_button: 'Contact a doctor',
                trouble_image: 'home_tercera.webp',

                journal_title: 'Visit our journal for some <br> advices',
                journal_description: 'Health Connectors also research different topics in the medical field — check some of them out!',
                journal_card1_image: 'home_journal.webp',
                journal_card1_title: 'Consult a professional',
                journal_card1_description: 'Consulting a medical professional is important because they provide expert guidance, accurate diagnoses, and tailored treatments, ensuring you receive the best care and improve health outcomes.',
                journal_card2_image: 'home_journal1.webp',
                journal_card2_title: 'Stay healthy',
                journal_card2_description: 'Staying healthy is crucial because it enhances quality of life, prevents illness, and boosts overall well-being, enabling you to live fully and effectively.',
                journal_card3_image: 'home_journal2.webp',
                journal_card3_title: 'Physical self-care',
                journal_card3_description: 'Physical self-care is important because it helps maintain your body\'s health, boosts energy, and prevents illness, allowing you to function optimally in daily life.',

                home_penultima_image: 'home_penultima_eng.webp',

                testimonial_h3: 'Testimonial <span data-text-key="testimonial_span">from our users</span>',
                testimonial_span: 'from our users',
                testimonial_blockquote: '"Your experience can help others. Share your story and be part of the change."',

                contact_h2: '<span id="color-container" data-text-key="contact_span1"> Get in</span> <span class="get-touch" data-text-key="contact_span2"> touch</span>',
                contact_span1: 'Get in',
                contact_span2: 'touch',
                contact_name_placeholder: 'Your name',
                contact_email_placeholder: 'Your email',
                contact_message_placeholder: 'Your message',
                contact_submit_button: 'Submit',
                contact_image: 'tipo-get-in-touch.webp',

                // Footer (common across pages)
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

            // --- Home page specific content ---
            const homeMainHeaderImage = document.querySelector('img[data-image-key="home_main_header_image"]');
            if (homeMainHeaderImage) homeMainHeaderImage.src = `/static/images/${texts.home_main_header_image}`;

            const healthConnectorsH1 = document.querySelector('h1[data-text-key="health_connectors_h1"]');
            if (healthConnectorsH1) healthConnectorsH1.innerHTML = texts.health_connectors_h1.replace('<br />', '<br>'); // Use innerHTML for <br>
            const healthConnectorsP1 = document.querySelector('p[data-text-key="health_connectors_p1"]');
            if (healthConnectorsP1) healthConnectorsP1.textContent = texts.health_connectors_p1;
            const healthConnectorsP2 = document.querySelector('p[data-text-key="health_connectors_p2"]');
            if (healthConnectorsP2) healthConnectorsP2.textContent = texts.health_connectors_p2;
            const findDoctorButtonMain = document.querySelector('button[data-text-key="find_doctor_button_main"]');
            if (findDoctorButtonMain) findDoctorButtonMain.textContent = texts.find_doctor_button_main;

            const featuredServicesTitle = document.querySelector('h1[data-text-key="featured_services_title"]');
            if (featuredServicesTitle) featuredServicesTitle.textContent = texts.featured_services_title;

            // Swiper slides (Service cards)
            const service1Image = document.querySelector('img[data-image-key="service1_image"]');
            if (service1Image) service1Image.src = `/static/images/${texts.service1_image}`;
            const service1Title = document.querySelector('h4[data-text-key="service1_title"]');
            if (service1Title) service1Title.textContent = texts.service1_title;
            const service1Description = document.querySelector('p[data-text-key="service1_description"]');
            if (service1Description) service1Description.textContent = texts.service1_description;

            const service2Image = document.querySelector('img[data-image-key="service2_image"]');
            if (service2Image) service2Image.src = `/static/images/${texts.service2_image}`;
            const service2Title = document.querySelector('h4[data-text-key="service2_title"]');
            if (service2Title) service2Title.textContent = texts.service2_title;
            const service2Description = document.querySelector('p[data-text-key="service2_description"]');
            if (service2Description) service2Description.textContent = texts.service2_description;

            const service3Image = document.querySelector('img[data-image-key="service3_image"]');
            if (service3Image) service3Image.src = `/static/images/${texts.service3_image}`;
            const service3Title = document.querySelector('h4[data-text-key="service3_title"]');
            if (service3Title) service3Title.textContent = texts.service3_title;
            const service3Description = document.querySelector('p[data-text-key="service3_description"]');
            if (service3Description) service3Description.textContent = texts.service3_description;

            const service4Image = document.querySelector('img[data-image-key="service4_image"]');
            if (service4Image) service4Image.src = `/static/images/${texts.service4_image}`;
            const service4Title = document.querySelector('h4[data-text-key="service4_title"]');
            if (service4Title) service4Title.textContent = texts.service4_title;
            const service4Description = document.querySelector('p[data-text-key="service4_description"]');
            if (service4Description) service4Description.textContent = texts.service4_description;

            const service5Image = document.querySelector('img[data-image-key="service5_image"]');
            if (service5Image) service5Image.src = `/static/images/${texts.service5_image}`;
            const service5Title = document.querySelector('h4[data-text-key="service5_title"]');
            if (service5Title) service5Title.textContent = texts.service5_title;
            const service5Description = document.querySelector('p[data-text-key="service5_description"]');
            if (service5Description) service5Description.textContent = texts.service5_description;

            const troubleH3 = document.querySelector('h3[data-text-key="trouble_h3"]');
            if (troubleH3) troubleH3.textContent = texts.trouble_h3;
            const contactDoctorTroubleButton = document.querySelector('button[data-text-key="contact_doctor_trouble_button"]');
            if (contactDoctorTroubleButton) contactDoctorTroubleButton.textContent = texts.contact_doctor_trouble_button;
            const troubleImage = document.querySelector('img[data-image-key="trouble_image"]');
            if (troubleImage) troubleImage.src = `/static/images/${texts.trouble_image}`;

            const journalTitle = document.querySelector('h2[data-text-key="journal_title"]');
            if (journalTitle) journalTitle.innerHTML = texts.journal_title.replace('<br />', '<br>');
            const journalDescription = document.querySelector('p[data-text-key="journal_description"]');
            if (journalDescription) journalDescription.textContent = texts.journal_description;

            // Journal cards (second carousel)
            const journalCard1Image = document.querySelector('img[data-image-key="journal_card1_image"]');
            if (journalCard1Image) journalCard1Image.src = `/static/images/${texts.journal_card1_image}`;
            const journalCard1Title = document.querySelector('h3[data-text-key="journal_card1_title"]');
            if (journalCard1Title) journalCard1Title.textContent = texts.journal_card1_title;
            const journalCard1Description = document.querySelector('p[data-text-key="journal_card1_description"]');
            if (journalCard1Description) journalCard1Description.textContent = texts.journal_card1_description;

            const journalCard2Image = document.querySelector('img[data-image-key="journal_card2_image"]');
            if (journalCard2Image) journalCard2Image.src = `/static/images/${texts.journal_card2_image}`;
            const journalCard2Title = document.querySelector('h3[data-text-key="journal_card2_title"]');
            if (journalCard2Title) journalCard2Title.textContent = texts.journal_card2_title;
            const journalCard2Description = document.querySelector('p[data-text-key="journal_card2_description"]');
            if (journalCard2Description) journalCard2Description.textContent = texts.journal_card2_description;

            const journalCard3Image = document.querySelector('img[data-image-key="journal_card3_image"]');
            if (journalCard3Image) journalCard3Image.src = `/static/images/${texts.journal_card3_image}`;
            const journalCard3Title = document = document.querySelector('h3[data-text-key="journal_card3_title"]');
            if (journalCard3Title) journalCard3Title.textContent = texts.journal_card3_title;
            const journalCard3Description = document.querySelector('p[data-text-key="journal_card3_description"]');
            if (journalCard3Description) journalCard3Description.textContent = texts.journal_card3_description;

            const homePenultimaImage = document.querySelector('img[data-image-key="home_penultima_image"]');
            if (homePenultimaImage) homePenultimaImage.src = `/static/images/${texts.home_penultima_image}`;

            const testimonialH3 = document.querySelector('h3[data-text-key="testimonial_h3"]');
            const testimonialSpan = document.querySelector('h3[data-text-key="testimonial_h3"] span[data-text-key="testimonial_span"]');
            if (testimonialH3 && testimonialSpan) {
                testimonialH3.innerHTML = texts.testimonial_h3.replace('<span data-text-key="testimonial_span">', '<span data-text-key="testimonial_span">' + texts.testimonial_span);
            }
            const testimonialBlockquote = document.querySelector('blockquote[data-text-key="testimonial_blockquote"]');
            if (testimonialBlockquote) testimonialBlockquote.textContent = texts.testimonial_blockquote;

            const contactH2 = document.querySelector('h2[data-text-key="contact_h2"]');
            const contactSpan1 = document.querySelector('span[data-text-key="contact_span1"]');
            const contactSpan2 = document.querySelector('span[data-text-key="contact_span2"]');
            if (contactH2 && contactSpan1 && contactSpan2) {
                contactH2.innerHTML = `<span id="color-container" data-text-key="contact_span1">${texts.contact_span1}</span> <span class="get-touch" data-text-key="contact_span2">${texts.contact_span2}</span>`;
            }

            const contactNamePlaceholder = document.querySelector('input[data-text-key="contact_name_placeholder"]');
            if (contactNamePlaceholder) contactNamePlaceholder.placeholder = texts.contact_name_placeholder;
            const contactEmailPlaceholder = document.querySelector('input[data-text-key="contact_email_placeholder"]');
            if (contactEmailPlaceholder) contactEmailPlaceholder.placeholder = texts.contact_email_placeholder;
            const contactMessagePlaceholder = document.querySelector('textarea[data-text-key="contact_message_placeholder"]');
            if (contactMessagePlaceholder) contactMessagePlaceholder.placeholder = texts.contact_message_placeholder;
            const contactSubmitButton = document.querySelector('button[data-text-key="contact_submit_button"]');
            if (contactSubmitButton) contactSubmitButton.textContent = texts.contact_submit_button;
            const contactImage = document.querySelector('img[data-image-key="contact_image"]');
            if (contactImage) contactImage.src = `/static/images/${texts.contact_image}`;


            // Footer (common across pages)
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
