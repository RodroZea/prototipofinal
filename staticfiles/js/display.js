class AnimationController {
        constructor() {
            this.animatedElements = new Set();
            this.observer = null;
            this.init();
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            this.setupIntersectionObserver();
            this.prepareElements();
            this.setupEventListeners();
            this.animateHeader();
        }

        setupIntersectionObserver() {
            const options = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: [0.1, 0.3, 0.5]
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animateElement(entry.target);
                        this.animatedElements.add(entry.target);
                    }
                });
            }, options);
        }

        prepareElements() {
            // Configuramos los elementos a animar para esta página específica
            const elementsConfig = [
                { selector: 'h1[data-text-key="main_h1"]', animation: 'fadeIn', direction: 'up', distance: 30 },
                { selector: 'p[data-text-key="main_p"]', animation: 'fadeIn', direction: 'up', distance: 30 },
                { selector: '.filters', animation: 'fadeInUp', direction: 'up', distance: 30 },
                { selector: '.card', animation: 'fadeInUp', direction: 'up', distance: 50 } // Animamos cada tarjeta
            ];

            elementsConfig.forEach(config => {
                // Para las tarjetas, queremos observar cada una individualmente
                if (config.selector === '.card') {
                    document.querySelectorAll(config.selector).forEach(element => {
                        this.prepareElement(element, config);
                        this.observer.observe(element);
                    });
                } else {
                    const element = document.querySelector(config.selector);
                    if (element) {
                        this.prepareElement(element, config);
                        this.observer.observe(element);
                    }
                }
            });
        }

        prepareElement(element, config) {
            element.style.opacity = '0';
            element.style.transition = 'transform 0.7s ease-out, opacity 0.7s ease-out';
            element.dataset.animationType = config.animation;

            switch (config.direction) {
                case 'up':
                    element.style.transform = `translateY(${config.distance}px)`;
                    break;
                case 'right':
                    element.style.transform = `translateX(-${config.distance}px)`;
                    break;
                default:
                    element.style.transform = `translateY(${config.distance || 20}px)`;
            }
        }

        animateElement(element) {
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translate(0, 0)';
                if (element.dataset.animationType && element.dataset.animationType.includes('animate__')) {
                    element.classList.add('animate__animated', element.dataset.animationType);
                }
            });
        }

        animateHeader() {
            const header = document.querySelector('header');
            if (header) {
                header.style.opacity = '0';
                header.style.transform = 'translateY(-20px)';
                header.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        header.style.opacity = '1';
                        header.style.transform = 'translateY(0)';
                    });
                }, 100);
            }
        }

        setupEventListeners() {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        // No hay lógica de scroll específica aquí, el observer se encarga
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            this.setupHoverAnimations();

            window.addEventListener('resize', this.debounce(() => {
                // No hay lógica de resize específica para animaciones en esta página
            }, 250));
        }

        setupHoverAnimations() {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', () => {
                    button.style.transform = 'scale(1.05)';
                    button.style.transition = 'transform 0.2s ease';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'scale(1)';
                });
            });

            const navLinks = document.querySelectorAll('.barra-navegacion a');
            navLinks.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    link.style.transform = 'translateY(-2px)';
                    link.style.transition = 'transform 0.2s ease';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.transform = 'translateY(0)';
                });
            });
        }

        debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        }
    }

    const animationController = new AnimationController();
    window.AnimationController = animationController;


    // ============================================================================================================
    // Lógica de Traducción y Menú de Idiomas
    // ============================================================================================================

    document.addEventListener('DOMContentLoaded', function() {
      const languageButton = document.getElementById('language-button');
      const languageMenu = document.getElementById('language-menu');
      const dropdownItems = document.querySelectorAll('.dropdown-item');
      
      languageButton.addEventListener('click', function(e) {
        e.stopPropagation();
        languageMenu.classList.toggle('show');
      });
      
      document.addEventListener('click', function(e) {
        if (!languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
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
          
          console.log('Idioma seleccionado:', selectedLang);
          
          languageMenu.classList.remove('show');
          
          changeLanguage(selectedLang);
          
          localStorage.setItem('selectedLanguage', selectedLang);
        });
      });
      
      function changeLanguage(lang) {
        const translations = {
          es: {
            // Título de la página
            pageTitle: 'Médicos disponibles',

            // Barra superior y navegación
            searchPlaceholder: 'Buscar',
            registerButton: 'Registrarse',
            loginButton: 'Iniciar Sesión',
            homeNav: 'Inicio',
            featuresNav: 'Funcionalidades y Beneficios',
            aboutNav: 'Acerca de Nosotros',
            blogNav: 'Blog',

            // Contenido Principal
            main_h1: 'Médicos disponibles',
            main_p: 'Reserva por internet y ahorra tiempo',

            filters_button_all: 'Todos los filtros',
            filters_button_age: 'Grupos de edad atendidos',
            filters_button_visit: 'Método de visita',

            doctor_tag: 'Aceptando nuevos pacientes',
            doctor_id_label: 'Cédula:',
            doctor_credential_label: 'Credencial:',
            doctor_email_label: 'Email:',
            doctor_phone_label: 'Teléfono:',
            specialties_label: 'Especialidades:',
            specialties_text: 'Endocrinología: Diabetes',
            hospital_label: 'Afiliación Hospitalaria:',
            hospital_1: 'Hospital Santísima Trinidad',
            hospital_2: 'Hospital San Juan',
            hospital_3: 'Hospital Regional San Vicente',


            clinic_name: 'Clínica Central – Especialidades Médicas',
            clinic_address: 'Dirección genérica aquí – ',
            view_map_link: 'Ver mapa',
            phone_label_location: 'Teléfono:',
            
            btn_schedule: 'Agendar cita',
            btn_info: 'Más información',
            no_doctors_message: 'No hay doctores registrados.',
            
            // Pie de página (ejemplo, ajustar si tu HTML tiene footer)
            footer_h3: 'Health\nConnectors', 
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
            footer_link_internet: 'Internet',
            footer_link_news: 'Agencias de noticias',
            footer_link_data: 'Alternativa de datos',
            footer_link_media: 'Medios',
            footer_link_defamation: 'Difamación',
            footer_recent_posts_h3: 'Publicaciones recientes',
          },
          en: {
            // Título de la página
            pageTitle: 'Available Doctors',

            // Barra superior y navegación
            searchPlaceholder: 'Search',
            registerButton: 'Register',
            loginButton: 'Login',
            homeNav: 'Home',
            featuresNav: 'Features and Benefits',
            aboutNav: 'About Us',
            blogNav: 'Blog',

            // Contenido Principal
            main_h1: 'Available Doctors',
            main_p: 'Book online and save time',

            filters_button_all: 'All filters',
            filters_button_age: 'Age groups seen',
            filters_button_visit: 'Visit Method',

            doctor_tag: 'Accepting new patients',
            doctor_id_label: 'ID Number:',
            doctor_credential_label: 'Credential:',
            doctor_email_label: 'Email:',
            doctor_phone_label: 'Phone:',
            specialties_label: 'Specialties:',
            specialties_text: 'Endocrinology: Diabetes',
            hospital_label: 'Hospital Affiliation:',
            hospital_1: 'Holy Rosary Hospital',
            hospital_2: 'St. James Hospital',
            hospital_3: 'St. Vincent Regional Hospital',
            
            clinic_name: 'Central Clinic – Medical Specialties',
            clinic_address: 'Generic Address here – ',
            view_map_link: 'View map',
            phone_label_location: 'Phone:',
            
            btn_schedule: 'Schedule appointment',
            btn_info: 'More information',
            no_doctors_message: 'No doctors registered.',

            // Pie de página (ejemplo, ajustar si tu HTML tiene footer)
            footer_h3: 'Health\nConnectors', 
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
            footer_link_internet: 'Internet',
            footer_link_news: 'News agencias',
            footer_link_data: 'Data Alternative',
            footer_link_media: 'Media',
            footer_link_defamation: 'Defamation',
            footer_recent_posts_h3: 'Recent posts',
          }
        };
        
        const texts = translations[lang];
        
        if (texts) {
          // Traducir el título de la página
          const pageTitleElement = document.querySelector('title[data-text-key="pageTitle"]');
          if (pageTitleElement) pageTitleElement.textContent = texts.pageTitle;

          // Cambiar placeholder del buscador
          const searchInput = document.querySelector('.busqueda input[data-text-key="searchPlaceholder"]');
          if (searchInput) {
            searchInput.placeholder = texts.searchPlaceholder;
          }
          
          // Cambiar texto de botones de la barra superior
          const registerButton = document.querySelector('.boton-registro[data-text-key="registerButton"]');
          if(registerButton) registerButton.textContent = texts.registerButton;
          
          const loginButton = document.querySelector('.boton-login[data-text-key="loginButton"]');
          if(loginButton) loginButton.textContent = texts.loginButton;
          
          // Cambiar navegación
          document.querySelectorAll('.barra-navegacion ul li a[data-nav-key]').forEach(link => {
            const key = link.getAttribute('data-nav-key');
            if (key && texts[key]) {
                link.textContent = texts[key];
            }
          });
          
          // Contenido principal
          const mainH1 = document.querySelector('h1[data-text-key="main_h1"]');
          if(mainH1) mainH1.textContent = texts.main_h1;
          const mainP = document.querySelector('p[data-text-key="main_p"]');
          if(mainP) mainP.textContent = texts.main_p;

          // Filtros
          const filtersButtonAll = document.querySelector('button[data-text-key="filters_button_all"]');
          if(filtersButtonAll) filtersButtonAll.textContent = texts.filters_button_all;
          const filtersButtonAge = document.querySelector('button[data-text-key="filters_button_age"]');
          if(filtersButtonAge) filtersButtonAge.textContent = texts.filters_button_age;
          const filtersButtonVisit = document.querySelector('button[data-text-key="filters_button_visit"]');
          if(filtersButtonVisit) filtersButtonVisit.textContent = texts.filters_button_visit;

          // Tarjetas de doctor (iterar sobre todas las tarjetas)
          document.querySelectorAll('.card').forEach(card => {
            const doctorTag = card.querySelector('.tag[data-text-key="doctor_tag"]');
            if(doctorTag) doctorTag.textContent = texts.doctor_tag;

            const doctorIdLabel = card.querySelector('p strong[data-text-key="doctor_id_label"]');
            if(doctorIdLabel) doctorIdLabel.textContent = texts.doctor_id_label;
            const doctorCredentialLabel = card.querySelector('p strong[data-text-key="doctor_credential_label"]');
            if(doctorCredentialLabel) doctorCredentialLabel.textContent = texts.doctor_credential_label;
            const doctorEmailLabel = card.querySelector('p strong[data-text-key="doctor_email_label"]');
            if(doctorEmailLabel) doctorEmailLabel.textContent = texts.doctor_email_label;
            const doctorPhoneLabel = card.querySelector('p strong[data-text-key="doctor_phone_label"]');
            if(doctorPhoneLabel) doctorPhoneLabel.textContent = texts.doctor_phone_label;
            
            const specialtiesLabel = card.querySelector('.specialties p strong[data-text-key="specialties_label"]');
            if(specialtiesLabel) specialtiesLabel.textContent = texts.specialties_label;
            const specialtiesText = card.querySelector('.specialties p span[data-text-key="specialties_text"]'); // Asumir un span para el texto
            if(specialtiesText) specialtiesText.textContent = texts.specialties_text;

            const hospitalLabel = card.querySelector('.specialties p strong[data-text-key="hospital_label"]');
            if(hospitalLabel) hospitalLabel.textContent = texts.hospital_label;
            
            // Traducción de los nombres de los hospitales
            const hospitalListItems = card.querySelectorAll('.specialties ul li[data-text-key]');
            if(hospitalListItems[0]) hospitalListItems[0].textContent = texts.hospital_1;
            if(hospitalListItems[1]) hospitalListItems[1].textContent = texts.hospital_2;
            if(hospitalListItems[2]) hospitalListItems[2].textContent = texts.hospital_3;


            const clinicName = card.querySelector('.location span[data-text-key="clinic_name"]');
            if(clinicName) clinicName.textContent = texts.clinic_name;
            const clinicAddress = card.querySelector('.location span[data-text-key="clinic_address"]');
            if(clinicAddress) clinicAddress.innerHTML = texts.clinic_address; // Usar innerHTML para el enlace
            const viewMapLink = card.querySelector('.location a[data-text-key="view_map_link"]');
            if(viewMapLink) viewMapLink.textContent = texts.view_map_link;
            const phoneLabelLocation = card.querySelector('.location strong[data-text-key="phone_label_location"]');
            if(phoneLabelLocation) phoneLabelLocation.textContent = texts.phone_label_location;

            const btnSchedule = card.querySelector('button.btn-schedule[data-text-key="btn_schedule"]');
            if(btnSchedule) btnSchedule.textContent = texts.btn_schedule;
            const btnInfo = card.querySelector('button.btn-info[data-text-key="btn_info"]');
            if(btnInfo) btnInfo.textContent = texts.btn_info;
          });

          // Mensaje de no doctores
          const noDoctorsMessage = document.querySelector('p[data-text-key="no_doctors_message"]');
          if (noDoctorsMessage) noDoctorsMessage.textContent = texts.no_doctors_message;

          // Pie de página (asumiendo que tiene la misma estructura que en journals anteriores)
          const footerColumns = document.querySelectorAll('footer .footer-column');
          if (footerColumns[0]) {
            const footerH3 = footerColumns[0].querySelector('h3[data-text-key="footer_h3"]');
            if(footerH3) footerH3.innerHTML = texts.footer_h3.replace('\n', '<br>');
            
            const footerP = footerColumns[0].querySelectorAll('p[data-text-key]');
            if (footerP[0]) footerP[0].textContent = texts.footer_p1;
            if (footerP[1]) footerP[1].textContent = texts.footer_p2;
            if (footerP[2]) footerP[2].textContent = texts.footer_p3;
            
            const socialButton = footerColumns[0].querySelector('button[data-text-key="footer_button"]');
            if (socialButton) socialButton.textContent = texts.footer_button;
          }

          if (footerColumns[1]) {
            const linksH3 = footerColumns[1].querySelector('h3[data-text-key="footer_links_h3"]');
            if(linksH3) linksH3.textContent = texts.footer_links_h3;
            
            const links = footerColumns[1].querySelectorAll('.footer-links li a[data-text-key]');
            if(links[0]) links[0].textContent = texts.footer_link_home;
            if(links[1]) links[1].textContent = texts.footer_link_pages;
            if(links[2]) links[2].textContent = texts.footer_link_services;
            if(links[3]) links[3].textContent = texts.footer_link_portfolio;
            if(links[4]) links[4].textContent = texts.footer_link_blog;
            if(links[5]) links[5].textContent = texts.footer_link_contact;
          }
          
          if (footerColumns[2]) {
            const links = footerColumns[2].querySelectorAll('.footer-links li a[data-text-key]');
            if(links[0]) links[0].textContent = texts.footer_link_internet;
            if(links[1]) links[1].textContent = texts.footer_link_news;
            if(links[2]) links[2].textContent = texts.footer_link_data;
            if(links[3]) links[3].textContent = texts.footer_link_media;
            if(links[4]) links[4].textContent = texts.footer_link_defamation;
          }

          if (footerColumns[3]) {
            const recentPostsH3 = footerColumns[3].querySelector('h3[data-text-key="footer_recent_posts_h3"]');
            if(recentPostsH3) recentPostsH3.textContent = texts.footer_recent_posts_h3;
          }

          // Cambiar el atributo lang del documento
          document.documentElement.lang = lang;
          
          // Opcional: Mostrar notificación de cambio
          showLanguageChangeNotification(lang);
        }
      }
      
      // Función para mostrar notificación (opcional)
      function showLanguageChangeNotification(lang) {
        const messages = {
          es: 'Idioma cambiado a Español',
          en: 'Language changed to English'
        };
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.textContent = messages[lang];
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #28a745;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
          notification.style.opacity = '1';
        }, 100);
        
        // Ocultar y eliminar notificación después de 3 segundos
        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 3000);
      }
      
      // Cargar idioma guardado al inicializar
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        changeLanguage(savedLanguage);
      } else {
        // Detectar idioma del navegador si no hay preferencia guardada
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
        changeLanguage(detectedLang);
      }
    });
