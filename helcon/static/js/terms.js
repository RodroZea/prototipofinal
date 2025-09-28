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
            { selector: '.terms-section h1', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.terms-section h2', animation: 'fadeInUp', direction: 'up', distance: 25 },
            { selector: '.terms-section p', animation: 'fadeInUp', direction: 'up', distance: 20 },
            { selector: '.terms-section ul li', animation: 'fadeInUp', direction: 'up', distance: 15 },
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
        pageTitle: 'Términos y Condiciones de Uso',

        // Barra superior y navegación
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',

        // Contenido de Términos y Condiciones
        terms_h1: 'Términos y Condiciones de Uso',
        terms_p1: 'Bienvenido a Health Connectors. Estos Términos y Condiciones explican cómo funciona nuestro servicio y qué esperamos de usted como usuario. Al acceder o utilizar nuestra plataforma, usted acepta estos términos. Si no está de acuerdo, por favor, no utilice nuestros servicios.',
        intro_h2: '1. Introducción',
        intro_p1: 'Health Connectors es una plataforma digital que conecta a los usuarios con proveedores de atención médica, ayudando a simplificar el acceso a los servicios médicos, rastrear datos de salud personal y ofrecer recomendaciones de bienestar personalizadas. Nuestro objetivo es hacer la atención médica más accesible, segura y de apoyo.',
        eligibility_h2: '2. Elegibilidad',
        eligibility_p1: 'Para usar Health Connectors, debe tener al menos 18 años o contar con el permiso de un padre o tutor legal si es menor de edad. Al crear una cuenta o utilizar nuestros servicios, usted confirma que la información que proporciona es verdadera y precisa.',
        services_h2: '3. Nuestros Servicios',
        services_p1: 'A través de Health Connectors, usted puede:',
        services_li1: 'Crear y gestionar un perfil de salud personal.',
        services_li2: 'Reservar y gestionar citas con proveedores de atención médica.',
        services_li3: 'Recibir información general de salud y recordatorios.',
        services_li4: 'Acceder a sugerencias y recursos basados en sus preferencias y hábitos.',
        services_p2: 'Por favor, recuerde que Health Connectors no sustituye el consejo, diagnóstico o tratamiento médico. Animamos a todos los usuarios a consultar a profesionales con licencia para cualquier preocupación médica seria.',
        responsibilities_h2: '4. Sus Responsabilidades',
        responsibilities_p1: 'Como usuario, usted acepta:',
        responsibilities_li1: 'Utilizar la plataforma de manera respetuosa y legal.',
        responsibilities_li2: 'Proporcionar información honesta y actualizada.',
        responsibilities_li3: 'No compartir su cuenta con otros.',
        responsibilities_li4: 'No utilizar el servicio para dañar, acosar o engañar a otros.',
        responsibilities_p2: 'Queremos que la plataforma siga siendo segura y acogedora para todos los usuarios.',
        data_h2: '5. Sus Datos',
        data_p1: 'Cuando utiliza Health Connectors, puede compartir datos personales y relacionados con la salud. Manejamos todos sus datos de manera responsable y de acuerdo con nuestra Política de Privacidad. Su información nos ayuda a mejorar su experiencia y ofrecer contenido personalizado.',
        data_p2: 'Nunca venderemos sus datos personales ni los compartiremos sin su permiso explícito, a menos que sea requerido por la ley o para proteger su seguridad.',
        security_h2: '6. Seguridad de la Cuenta',
        security_p1: 'Usted es responsable de mantener seguras las credenciales de su cuenta. Por favor, no comparta su contraseña. Si nota algo inusual o cree que su cuenta fue accedida sin permiso, infórmenos de inmediato para que podamos ayudar a proteger su información.',
        content_use_h2: '7. Contenido y Uso',
        content_use_p1: 'Todo lo que ve en la plataforma (textos, gráficos, diseño y funciones) forma parte de nuestro servicio. Puede utilizarlo únicamente para fines personales y no comerciales. Por favor, no copie, modifique ni utilice indebidamente el contenido, y siempre respete el trabajo de nuestro equipo y socios.',
        updates_h2: '8. Actualizaciones de la Plataforma',
        updates_p1: 'Podemos mejorar o actualizar nuestra plataforma regularmente. A veces, las funciones pueden cambiar o eliminarse para mejorar la experiencia del usuario. Haremos todo lo posible para mantenerlo informado cuando ocurran actualizaciones importantes, y agradecemos sus comentarios a medida que crecemos.',
        privacy_section_h2: '9. Privacidad',
        privacy_section_p1: 'Nos preocupamos profundamente por su privacidad. Nuestra plataforma sigue estrictos estándares para garantizar que su información permanezca protegida. Recopilamos solo los datos que necesitamos para mejorar su experiencia y utilizamos herramientas de cifrado y seguridad para mantenerlos seguros.',
        privacy_section_p2: 'Para más detalles sobre cómo manejamos su información personal y de salud, por favor, lea nuestra Política de Privacidad completa.',
        
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
        pageTitle: 'Terms and Conditions of Use',

        // Barra superior y navegación
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Features and Benefits',
        aboutNav: 'About Us',
        blogNav: 'Blog',

        // Contenido de Términos y Condiciones
        terms_h1: 'Terms and Conditions of Use',
        terms_p1: 'Welcome to Health Connectors. These Terms and Conditions explain how our service works and what we expect from you as a user. By accessing or using our platform, you agree to these terms. If you don’t agree, please do not use our services.',
        intro_h2: '1. Introduction',
        intro_p1: 'Health Connectors is a digital platform that connects users with healthcare providers, helping to simplify access to medical services, track personal health data, and offer personalized wellness recommendations. Our goal is to make healthcare more accessible, safe, and supportive.',
        eligibility_h2: '2. Eligibility',
        eligibility_p1: 'To use Health Connectors, you must be at least 18 years old or have permission from a parent or legal guardian if you are a minor. By creating an account or using our services, you confirm that the information you provide is true and accurate.',
        services_h2: '3. Our Services',
        services_p1: 'Through Health Connectors, you can:',
        services_li1: 'Create and manage a personal health profile.',
        services_li2: 'Book and manage appointments with healthcare providers.',
        services_li3: 'Receive general health information and reminders.',
        services_li4: 'Access suggestions and resources based on your preferences and habits.',
        services_p2: 'Please remember that Health Connectors is not a substitute for medical advice, diagnosis, or treatment. We encourage all users to consult licensed professionals for any serious medical concerns.',
        responsibilities_h2: '4. Your Responsibilities',
        responsibilities_p1: 'As a user, you agree to:',
        responsibilities_li1: 'Use the platform respectfully and legally.',
        responsibilities_li2: 'Provide honest and updated information.',
        services_p2: 'Please remember that Health Connectors is not a substitute for medical advice, diagnosis, or treatment. We encourage all users to consult licensed professionals for any serious medical concerns.',
        responsibilities_h2: '4. Your Responsibilities',
        responsibilities_p1: 'As a user, you agree to:',
        responsibilities_li1: 'Use the platform respectfully and legally.',
        responsibilities_li2: 'Provide honest and updated information.',
        responsibilities_li3: 'Not share your account with others.',
        responsibilities_li4: 'Not use the service to harm, harass, or mislead others.',
        responsibilities_p2: 'We want the platform to remain safe and welcoming for all users.',
        data_h2: '5. Your Data',
        data_p1: 'When you use Health Connectors, you may share personal and health-related data. We handle all your data responsibly and according to our Privacy Policy. Your information helps us improve your experience and offer personalized content.',
        data_p2: 'We will never sell your personal data or share it without your clear permission, unless required by law or to protect your safety.',
        security_h2: '6. Account Security',
        security_p1: 'You are responsible for keeping your account credentials safe. Please do not share your password. If you notice anything unusual or think your account was accessed without permission, let us know immediately so we can help protect your information.',
        content_use_h2: '7. Content and Use',
        content_use_p1: 'Everything you see on the platform—texts, graphics, layout, and features—is part of our service. You can use it for personal, non-commercial purposes only. Please do not copy, modify, or misuse the content, and always respect the work of our team and partners.',
        updates_h2: '8. Platform Updates',
        updates_p1: 'We may improve or update our platform regularly. Sometimes, features might change or be removed to improve user experience. We will do our best to keep you informed when major updates happen, and we appreciate your feedback as we grow.',
        privacy_section_h2: '9. Privacy',
        privacy_section_p1: 'We care deeply about your privacy. Our platform follows strict standards to ensure your information stays protected. We collect only the data we need to make your experience better, and we use encryption and security tools to keep it safe.',
        privacy_section_p2: 'For more details on how we handle your personal and health information, please read our full Privacy Policy.',
        
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
      
      // Contenido de Términos y Condiciones
      const termsH1 = document.querySelector('h1[data-text-key="terms_h1"]');
      if (termsH1) termsH1.textContent = texts.terms_h1;
      const termsP1 = document.querySelector('p[data-text-key="terms_p1"]');
      if (termsP1) termsP1.textContent = texts.terms_p1;

      const introH2 = document.querySelector('h2[data-text-key="intro_h2"]');
      if (introH2) introH2.textContent = texts.intro_h2;
      const introP1 = document.querySelector('p[data-text-key="intro_p1"]');
      if (introP1) introP1.textContent = texts.intro_p1;

      const eligibilityH2 = document.querySelector('h2[data-text-key="eligibility_h2"]');
      if (eligibilityH2) eligibilityH2.textContent = texts.eligibility_h2;
      const eligibilityP1 = document.querySelector('p[data-text-key="eligibility_p1"]');
      if (eligibilityP1) eligibilityP1.textContent = texts.eligibility_p1;

      const servicesH2 = document.querySelector('h2[data-text-key="services_h2"]');
      if (servicesH2) servicesH2.textContent = texts.services_h2;
      const servicesP1 = document.querySelector('p[data-text-key="services_p1"]');
      if (servicesP1) servicesP1.textContent = texts.services_p1;
      const servicesLIs = document.querySelectorAll('.terms-section ul li[data-text-key^="services_li"]');
      if (servicesLIs[0]) servicesLIs[0].textContent = texts.services_li1;
      if (servicesLIs[1]) servicesLIs[1].textContent = texts.services_li2;
      if (servicesLIs[2]) servicesLIs[2].textContent = texts.services_li3;
      if (servicesLIs[3]) servicesLIs[3].textContent = texts.services_li4;
      const servicesP2 = document.querySelector('p[data-text-key="services_p2"]');
      if (servicesP2) servicesP2.textContent = texts.services_p2;

      const responsibilitiesH2 = document.querySelector('h2[data-text-key="responsibilities_h2"]');
      if (responsibilitiesH2) responsibilitiesH2.textContent = texts.responsibilities_h2;
      const responsibilitiesP1 = document.querySelector('p[data-text-key="responsibilities_p1"]');
      if (responsibilitiesP1) responsibilitiesP1.textContent = texts.responsibilities_p1;
      const responsibilitiesLIs = document.querySelectorAll('.terms-section ul li[data-text-key^="responsibilities_li"]');
      if (responsibilitiesLIs[0]) responsibilitiesLIs[0].textContent = texts.responsibilities_li1;
      if (responsibilitiesLIs[1]) responsibilitiesLIs[1].textContent = texts.responsibilities_li2;
      if (responsibilitiesLIs[2]) responsibilitiesLIs[2].textContent = texts.responsibilities_li3;
      if (responsibilitiesLIs[3]) responsibilitiesLIs[3].textContent = texts.responsibilities_li4;
      const responsibilitiesP2 = document.querySelector('p[data-text-key="responsibilities_p2"]');
      if (responsibilitiesP2) responsibilitiesP2.textContent = texts.responsibilities_p2;

      const dataH2 = document.querySelector('h2[data-text-key="data_h2"]');
      if (dataH2) dataH2.textContent = texts.data_h2;
      const dataP1 = document.querySelector('p[data-text-key="data_p1"]');
      if (dataP1) dataP1.textContent = texts.data_p1;
      const dataP2 = document.querySelector('p[data-text-key="data_p2"]');
      if (dataP2) dataP2.textContent = texts.data_p2;

      const securityH2 = document.querySelector('h2[data-text-key="security_h2"]');
      if (securityH2) securityH2.textContent = texts.security_h2;
      const securityP1 = document.querySelector('p[data-text-key="security_p1"]');
      if (securityP1) securityP1.textContent = texts.security_p1;

      const contentUseH2 = document.querySelector('h2[data-text-key="content_use_h2"]');
      if (contentUseH2) contentUseH2.textContent = texts.content_use_h2;
      const contentUseP1 = document.querySelector('p[data-text-key="content_use_p1"]');
      if (contentUseP1) contentUseP1.textContent = texts.content_use_p1;

      const updatesH2 = document.querySelector('h2[data-text-key="updates_h2"]');
      if (updatesH2) updatesH2.textContent = texts.updates_h2;
      const updatesP1 = document.querySelector('p[data-text-key="updates_p1"]');
      if (updatesP1) updatesP1.textContent = texts.updates_p1;

      const privacySectionH2 = document.querySelector('h2[data-text-key="privacy_section_h2"]');
      if (privacySectionH2) privacySectionH2.textContent = texts.privacy_section_h2;
      const privacySectionP1 = document.querySelector('p[data-text-key="privacy_section_p1"]');
      if (privacySectionP1) privacySectionP1.textContent = texts.privacy_section_p1;
      const privacySectionP2 = document.querySelector('p[data-text-key="privacy_section_p2"]');
      if (privacySectionP2) privacySectionP2.textContent = texts.privacy_section_p2;

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