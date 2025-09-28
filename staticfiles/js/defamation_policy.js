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
            { selector: '.defamation-policy-section h1', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.defamation-policy-section h2', animation: 'fadeInUp', direction: 'up', distance: 25 },
            { selector: '.defamation-policy-section p', animation: 'fadeInUp', direction: 'up', distance: 20 },
            { selector: '.defamation-policy-section ul li', animation: 'fadeInUp', direction: 'up', distance: 15 },
            { selector: '.main-footer', animation: 'fadeInUp', direction: 'up', distance: 40 }
        ];

        elementsConfig.forEach(config => {
            if (config.selector.includes('p') || config.selector.includes('li') || config.selector.includes('h2')) {
                document.querySelectorAll(config.selector).forEach((element, index) => {
                    this.prepareElement(element, config);
                    element.style.transitionDelay = `${index * 0.05}s`; // Stagger effect
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
        pageTitle: 'Política de Difamación',

        // Barra superior y navegación
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',

        // Contenido de la Política de Difamación
        defamation_h1: 'Política de Difamación',
        defamation_p1: 'En Health Connectors, creemos en la creación de un entorno seguro y respetuoso donde los usuarios y los proveedores de atención médica puedan interactuar con confianza. Eso significa que nos tomamos muy en serio cualquier contenido que pueda considerarse difamatorio, ofensivo o perjudicial para otros.',
        defamation_intro_h2: 'La difamación, en este contexto, se refiere al acto de hacer declaraciones falsas o engañosas sobre una persona u organización que puedan dañar su reputación, ya sea directa o indirectamente. Esto incluye, entre otros:',
        defamation_li1: 'Acusar a una persona o proveedor de algo grave sin pruebas.',
        defamation_li2: 'Difundir información no verificada con la intención de dañar la imagen de alguien.',
        defamation_li3: 'Publicar reseñas, mensajes o publicaciones que sean abusivas, humillantes o que tengan como objetivo causar miedo o vergüenza pública.',
        defamation_li4: 'Usar perfiles falsos para hacerse pasar por otros o manipular opiniones.',
        defamation_not_tolerate_h2: 'No toleramos:',
        defamation_not_tolerate_li1: 'Ataques personales a profesionales de la salud o usuarios.',
        defamation_not_tolerate_li2: 'Información de salud engañosa que pueda causar daño o confusión.',
        defamation_not_tolerate_li3: 'Acoso, amenazas o discurso de odio en cualquier forma.',
        defamation_not_tolerate_li4: 'La vergüenza pública o los intentos de sabotear el trabajo profesional de alguien.',
        defamation_report_h2: 'Si considera que alguien ha publicado contenido difamatorio o perjudicial:',
        defamation_report_p1: 'Puede informarlo directamente a nuestro equipo de soporte utilizando las herramientas de la aplicación o poniéndose en contacto con nosotros en [Insertar información de contacto]. Nos tomamos estos informes en serio y:',
        defamation_report_li1: 'Revisaremos el contenido y el contexto cuidadosamente.',
        defamation_report_li2: 'Tomaremos las medidas adecuadas, que pueden incluir la eliminación del contenido, la advertencia al usuario o la suspensión o prohibición de la cuenta.',
        defamation_report_li3: 'Notificaremos a las partes afectadas si es necesario.',
        defamation_report_p2: 'Tenga en cuenta que la libertad de expresión no incluye el derecho a dañar a otros, difundir falsedades o perturbar la comunidad. Fomentamos la retroalimentación honesta y las conversaciones, pero deben expresarse con respeto y basarse en hechos.',
        defamation_consequences_h2: 'Consecuencias por Difamación o Comportamiento Nocivo:',
        defamation_consequences_p1: 'Dependiendo de la gravedad y la frecuencia, podemos:',
        defamation_consequences_li1: 'Eliminar u ocultar el contenido dañino.',
        defamation_consequences_li2: 'Enviar una advertencia o recordatorio sobre nuestras Directrices de la comunidad.',
        defamation_consequences_li3: 'Suspender temporalmente o desactivar permanentemente la cuenta involucrada.',
        defamation_consequences_li4: 'En casos graves o repetidos, podemos cooperar con las autoridades pertinentes si la situación lo exige.',
        defamation_consequences_p2: 'Queremos que todos los usuarios de Health Connectors se sientan seguros de que su integridad personal y profesional es respetada. Nuestra comunidad se basa en la confianza, y todos compartimos la responsabilidad de protegerla.',
        
        // Pie de página
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
        footer_link_privacy: 'Políticas de privacidad',
        footer_link_terms: 'Términos de uso',
        footer_link_signup: 'Registrarse',
        footer_link_login: 'Iniciar sesión',
        footer_link_defamation: 'Difamación',
        footer_recent_posts_h3: 'Publicaciones recientes',
      },
      en: {
        // Título de la página
        pageTitle: 'Defamation Policy',

        // Barra superior y navegación
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Features and Benefits',
        aboutNav: 'About Us',
        blogNav: 'Blog',

        // Contenido de la Política de Difamación
        defamation_h1: 'Defamation Policy',
        defamation_p1: 'At Health Connectors, we believe in creating a safe and respectful environment where users and healthcare providers can interact with trust. That means we take very seriously any content that may be considered defamatory, offensive, or harmful to others.',
        defamation_intro_h2: 'Defamation, in this context, refers to the act of making false or misleading statements about a person or organization that can harm their reputation, either directly or indirectly. This includes—but is not limited to:',
        defamation_li1: 'Accusing a person or provider of something serious without proof.',
        defamation_li2: 'Spreading unverified information with the intent to damage someone’s image.',
        defamation_li3: 'Publishing reviews, messages, or posts that are abusive, humiliating, or meant to cause fear or public shaming.',
        defamation_li4: 'Using fake profiles to impersonate others or manipulate opinions.',
        defamation_not_tolerate_h2: 'We do not tolerate:',
        defamation_not_tolerate_li1: 'Personal attacks on healthcare professionals or users.',
        defamation_not_tolerate_li2: 'Misleading health information that could cause harm or confusion.',
        defamation_not_tolerate_li3: 'Harassment, threats, or hate speech in any form.',
        defamation_not_tolerate_li4: 'Public shaming or attempts to sabotage someone’s professional work.',
        defamation_report_h2: 'If you feel someone has posted defamatory or harmful content:',
        defamation_report_p1: 'You can report it directly to our support team using the in-app tools or by contacting us at [Insert contact info]. We take these reports seriously and will:',
        defamation_report_li1: 'Review the content and context carefully.',
        defamation_report_li2: 'Take appropriate action, which may include removing the content, warning the user, or suspending or banning the account.',
        defamation_report_li3: 'Notify the affected parties if necessary.',
        defamation_report_p2: 'Please note that freedom of speech does not include the right to harm others, spread falsehoods, or disrupt the community. We encourage honest feedback and conversations, but they must be expressed respectfully and based on facts.',
        defamation_consequences_h2: 'Consequences for Defamation or Harmful Behavior:',
        defamation_consequences_p1: 'Depending on the severity and frequency, we may:',
        defamation_consequences_li1: 'Remove or hide the harmful content.',
        defamation_consequences_li2: 'Send a warning or reminder about our Community Guidelines.',
        defamation_consequences_li3: 'Temporarily suspend or permanently deactivate the account involved.',
        defamation_consequences_li4: 'In serious or repeated cases, we may cooperate with relevant authorities if the situation demands it.',
        defamation_consequences_p2: 'We want every user of Health Connectors to feel confident that their personal and professional integrity is respected. Our community thrives on trust, and we all share the responsibility to protect it.',
        
        // Pie de página
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
      
      // Contenido de la Política de Difamación
      const defamationH1 = document.querySelector('h1[data-text-key="defamation_h1"]');
      if (defamationH1) defamationH1.textContent = texts.defamation_h1;
      const defamationP1 = document.querySelector('p[data-text-key="defamation_p1"]');
      if (defamationP1) defamationP1.textContent = texts.defamation_p1;

      const defamationIntroH2 = document.querySelector('h2[data-text-key="defamation_intro_h2"]');
      if (defamationIntroH2) defamationIntroH2.textContent = texts.defamation_intro_h2;
      const defamationLIs = document.querySelectorAll('li[data-text-key^="defamation_li"]');
      if (defamationLIs[0]) defamationLIs[0].textContent = texts.defamation_li1;
      if (defamationLIs[1]) defamationLIs[1].textContent = texts.defamation_li2;
      if (defamationLIs[2]) defamationLIs[2].textContent = texts.defamation_li3;
      if (defamationLIs[3]) defamationLIs[3].textContent = texts.defamation_li4;

      const defamationNotTolerateH2 = document.querySelector('h2[data-text-key="defamation_not_tolerate_h2"]');
      if (defamationNotTolerateH2) defamationNotTolerateH2.textContent = texts.defamation_not_tolerate_h2;
      const defamationNotTolerateLIs = document.querySelectorAll('li[data-text-key^="defamation_not_tolerate_li"]');
      if (defamationNotTolerateLIs[0]) defamationNotTolerateLIs[0].textContent = texts.defamation_not_tolerate_li1;
      if (defamationNotTolerateLIs[1]) defamationNotTolerateLIs[1].textContent = texts.defamation_not_tolerate_li2;
      if (defamationNotTolerateLIs[2]) defamationNotTolerateLIs[2].textContent = texts.defamation_not_tolerate_li3;
      if (defamationNotTolerateLIs[3]) defamationNotTolerateLIs[3].textContent = texts.defamation_not_tolerate_li4;

      const defamationReportH2 = document.querySelector('h2[data-text-key="defamation_report_h2"]');
      if (defamationReportH2) defamationReportH2.textContent = texts.defamation_report_h2;
      const defamationReportP1 = document.querySelector('p[data-text-key="defamation_report_p1"]');
      if (defamationReportP1) defamationReportP1.textContent = texts.defamation_report_p1;
      const defamationReportLIs = document.querySelectorAll('li[data-text-key^="defamation_report_li"]');
      if (defamationReportLIs[0]) defamationReportLIs[0].textContent = texts.defamation_report_li1;
      if (defamationReportLIs[1]) defamationReportLIs[1].textContent = texts.defamation_report_li2;
      if (defamationReportLIs[2]) defamationReportLIs[2].textContent = texts.defamation_report_li3;
      const defamationReportP2 = document.querySelector('p[data-text-key="defamation_report_p2"]');
      if (defamationReportP2) defamationReportP2.textContent = texts.defamation_report_p2;

      const defamationConsequencesH2 = document.querySelector('h2[data-text-key="defamation_consequences_h2"]');
      if (defamationConsequencesH2) defamationConsequencesH2.textContent = texts.defamation_consequences_h2;
      const defamationConsequencesP1 = document.querySelector('p[data-text-key="defamation_consequences_p1"]');
      if (defamationConsequencesP1) defamationConsequencesP1.textContent = texts.defamation_consequences_p1;
      const defamationConsequencesLIs = document.querySelectorAll('li[data-text-key^="defamation_consequences_li"]');
      if (defamationConsequencesLIs[0]) defamationConsequencesLIs[0].textContent = texts.defamation_consequences_li1;
      if (defamationConsequencesLIs[1]) defamationConsequencesLIs[1].textContent = texts.defamation_consequences_li2;
      if (defamationConsequencesLIs[2]) defamationConsequencesLIs[2].textContent = texts.defamation_consequences_li3;
      if (defamationConsequencesLIs[3]) defamationConsequencesLIs[3].textContent = texts.defamation_consequences_li4;
      const defamationConsequencesP2 = document.querySelector('p[data-text-key="defamation_consequences_p2"]');
      if (defamationConsequencesP2) defamationConsequencesP2.textContent = texts.defamation_consequences_p2;

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
