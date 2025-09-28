// ============================================================================================================
// Clase AnimationController: Gestiona las animaciones de elementos al hacer scroll y hover
// (Adaptada para esta página)
// ============================================================================================================
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
            { selector: '.privacy-policy-section h1', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.privacy-policy-section p', animation: 'fadeInUp', direction: 'up', distance: 20 },
            { selector: '.main-footer', animation: 'fadeInUp', direction: 'up', distance: 40 }
        ];

        elementsConfig.forEach(config => {
            // Para los párrafos, queremos observar cada uno individualmente para un efecto escalonado
            if (config.selector === '.privacy-policy-section p') {
                document.querySelectorAll(config.selector).forEach((element, index) => {
                    this.prepareElement(element, config);
                    // Aplica un retardo escalonado a los párrafos
                    element.style.transitionDelay = `${index * 0.1}s`; 
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
        pageTitle: 'Políticas de Privacidad', // Título para esta página

        // Barra superior y navegación
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',

        // Contenido de Políticas de Privacidad
        privacy_h1: 'Políticas de Privacidad',
        privacy_p1: 'En Health Connectors, valoramos la privacidad de nuestros usuarios y nos comprometemos a proteger la información personal y relacionada con la salud que nos confían. Toda la información recopilada a través de nuestra plataforma, incluidos los datos de contacto, el historial médico, los hábitos de salud y cualquier otro dato sensible, se maneja con estricta confidencialidad y de acuerdo con las leyes de protección de datos aplicables.',
        privacy_p2: 'Utilizamos estos datos únicamente para facilitar las conexiones con proveedores de atención médica, mejorar nuestros servicios y ofrecer recomendaciones personalizadas. No compartimos información personal con terceros sin consentimiento explícito, excepto en los casos requeridos por la ley o cuando sea necesario para garantizar la seguridad del usuario.',
        privacy_p3: 'Además, implementamos medidas de seguridad técnicas y administrativas para evitar el acceso no autorizado, la pérdida o la alteración de la información. Al utilizar Health Connectors, el usuario acepta nuestra política de privacidad y autoriza el procesamiento de sus datos de acuerdo con los fines descritos. Nos reservamos el derecho de actualizar esta política y notificaremos a los usuarios cualquier cambio relevante a través de nuestros canales oficiales.',
        
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
        footer_link_privacy: 'Políticas de privacidad', // Nuevo enlace de footer
        footer_link_terms: 'Términos de uso',
        footer_link_signup: 'Registrarse',
        footer_link_login: 'Iniciar sesión',
        footer_link_defamation: 'Difamación',
        footer_recent_posts_h3: 'Publicaciones recientes',
      },
      en: {
        // Título de la página
        pageTitle: 'Privacy Policies',

        // Barra superior y navegación
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Features and Benefits',
        aboutNav: 'About Us',
        blogNav: 'Blog',

        // Contenido de Políticas de Privacidad
        privacy_h1: 'Privacy Policies',
        privacy_p1: 'At Health Connectors, we value our users\' privacy and are committed to protecting the personal and health-related information entrusted to us. All information collected through our platform—including contact details, medical history, health habits, and any other sensitive data—is handled with strict confidentiality and in accordance with applicable data protection laws.',
        privacy_p2: 'We use this data solely to facilitate connections with healthcare providers, improve our services, and offer personalized recommendations. We do not share personal information with third parties without explicit consent, except in cases required by law or when necessary to ensure the user\'s safety.',
        privacy_p3: 'Additionally, we implement technical and administrative security measures to prevent unauthorized access, loss, or alteration of information. By using Health Connectors, the user agrees to our privacy policy and authorizes the processing of their data according to the purposes described. We reserve the right to update this policy and will notify users of any relevant changes through our official channels.',
        
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
        footer_link_privacy: 'Privacy policies',
        footer_link_terms: 'Terms of use',
        footer_link_signup: 'Sign up',
        footer_link_login: 'Login',
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
      const registerButton = document.querySelector('button[data-text-key="registerButton"]');
      if(registerButton) registerButton.textContent = texts.registerButton;
      
      const loginButton = document.querySelector('button[data-text-key="loginButton"]');
      if(loginButton) loginButton.textContent = texts.loginButton;
      
      // Cambiar navegación
      document.querySelectorAll('.barra-navegacion ul li a[data-nav-key]').forEach(link => {
        const key = link.getAttribute('data-nav-key');
        if (key && texts[key]) {
            link.textContent = texts[key];
        }
      });
      
      // Contenido de Políticas de Privacidad
      const privacyH1 = document.querySelector('h1[data-text-key="privacy_h1"]');
      if (privacyH1) privacyH1.textContent = texts.privacy_h1;
      const privacyP1 = document.querySelector('p[data-text-key="privacy_p1"]');
      if (privacyP1) privacyP1.textContent = texts.privacy_p1;
      const privacyP2 = document.querySelector('p[data-text-key="privacy_p2"]');
      if (privacyP2) privacyP2.textContent = texts.privacy_p2;
      const privacyP3 = document.querySelector('p[data-text-key="privacy_p3"]');
      if (privacyP3) privacyP3.textContent = texts.privacy_p3;

      // Pie de página
      const footerH3 = document.querySelector('footer .footer-column h3[data-text-key="footer_h3"]');
      if(footerH3) footerH3.innerHTML = texts.footer_h3.replace('\n', '<br>');
      
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
      
      // Asumiendo que los enlaces del footer tienen data-text-key
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
