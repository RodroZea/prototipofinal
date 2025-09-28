 // ============================================================================================================
// Clase AnimationController: Gestiona las animaciones de elementos al hacer scroll y hover
// ============================================================================================================
class AnimationController {
    constructor() {
        this.animatedElements = new Set(); // Almacena elementos ya animados para evitar re-animación
        this.observer = null; // Observador de intersección para detectar elementos en la vista
        this.init(); // Inicializa la configuración
    }

    // Inicializa el controlador, esperando a que el DOM esté completamente cargado
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    // Configura el Intersection Observer, prepara elementos y listeners
    setup() {
        this.setupIntersectionObserver();
        this.prepareElements();
        this.setupEventListeners();
        this.animateHeader(); // Anima el encabezado al cargar la página
    }

    // Configura el Intersection Observer para detectar cuando los elementos entran en la vista
    setupIntersectionObserver() {
        const options = {
            root: null, // El viewport es el elemento raíz
            rootMargin: '0px 0px -10% 0px', // Un margen inferior para que la animación se dispare un poco antes de que el elemento esté completamente visible
            threshold: [0.1, 0.3, 0.5] // Dispara el callback cuando el 10%, 30% o 50% del elemento es visible
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si el elemento está intersectando y no ha sido animado aún
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target); // Anima el elemento
                    this.animatedElements.add(entry.target); // Añade a los elementos animados
                }
            });
        }, options);
    }

    // Prepara los elementos a animar, estableciendo sus estilos iniciales y observándolos
    prepareElements() {
        const elementsConfig = [
            { selector: 'img[data-image-key="image_act_now"]', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.contenido1', animation: 'custom', direction: 'stagger' },
            { selector: '.contenido2', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: 'img[data-image-key="image_primary_health"]', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.contenido3', animation: 'fadeInRight', direction: 'right', distance: 50 },
            { selector: '.media-player-section', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.main-footer', animation: 'fadeInUp', direction: 'up', distance: 40 }
        ];

        elementsConfig.forEach(config => {
            const element = document.querySelector(config.selector);
            if (element) {
                this.prepareElement(element, config);
                this.observer.observe(element);
            }
        });
    }

    // Establece los estilos iniciales de opacidad y transformación para un elemento
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
            case 'stagger':
                this.prepareStaggerElement(element);
                break;
            default:
                element.style.transform = `translateY(${config.distance || 20}px)`;
        }
    }

    prepareStaggerElement(element) {
        const children = element.querySelectorAll('h1, h2, h3, p, li');
        children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
            child.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            child.dataset.staggerIndex = index;
        });
    }

    animateElement(element) {
        const animationType = element.dataset.animationType;
        if (animationType === 'custom') {
            this.animateStaggerElement(element);
        } else {
            this.animateStandardElement(element);
        }
        this.animateListItems(element);
    }

    animateStandardElement(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
            if (element.dataset.animationType && element.dataset.animationType.includes('animate__')) {
                element.classList.add('animate__animated', element.dataset.animationType);
            }
        });
    }

    animateStaggerElement(element) {
        element.style.opacity = '1';
        const children = element.querySelectorAll('[data-stagger-index]');
        children.forEach((child, index) => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateX(0)';
                });
            }, index * 150);
        });
    }

    animateListItems(element) {
        const olItems = element.querySelectorAll('ol li');
        if (olItems.length > 0 && !element.hasAttribute('data-ol-animated')) {
            element.setAttribute('data-ol-animated', 'true');
            this.staggerAnimate(olItems, 200, 'translateX(-20px)');
        }

        const ulItems = element.querySelectorAll('ul li');
        if (ulItems.length > 0 && !element.hasAttribute('data-ul-animated')) {
            element.setAttribute('data-ul-animated', 'true');
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
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        this.setupHoverAnimations();

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    handleScroll() {}

    handleResize() {}

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

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animatedElements.clear();
    }

    addElement(selector, config) {
        const element = document.querySelector(selector);
        if (element) {
            this.prepareElement(element, config);
            this.observer.observe(element);
        }
    }
}

const animationController = new AnimationController();
window.AnimationController = animationController;

// language-dropdown.js

document.addEventListener('DOMContentLoaded', function() {
  const languageButton = document.getElementById('language-button');
  const languageMenu = document.getElementById('language-menu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  
  // Alternar menú al hacer clic en el botón
  languageButton.addEventListener('click', function(e) {
    e.stopPropagation();
    languageMenu.classList.toggle('show');
  });
  
  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
      languageMenu.classList.remove('show');
    }
  });
  
  // Cerrar menú al presionar Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      languageMenu.classList.remove('show');
    }
  });
  
  // Manejar selección de idioma
  dropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const selectedLang = this.getAttribute('data-lang');
      const langName = this.textContent.trim();
      
      // Log para debugging
      console.log('Idioma seleccionado:', selectedLang);
      
      // Cerrar el menú
      languageMenu.classList.remove('show');
      
      // Cambiar el idioma de la página
      changeLanguage(selectedLang);
      
      // Opcional: Guardar preferencia en localStorage
      localStorage.setItem('selectedLanguage', selectedLang);
    });
  });
  
  // Función para cambiar el idioma
  function changeLanguage(lang) {
    const translations = {
      es: {
        // Título de la página
        pageTitle: 'Atención Primaria de Salud',

        // Barra superior y navegación
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',

        // Imágenes principales y de contenido
        image_act_now: 'actua_ahora_esp.webp', // Asume una versión en español
        image_primary_health: 'atencion_primaria_esp.webp', // Asume una versión en español
        
        // Contenido Principal
        contenido1_h2_1: 'Atención Preventiva',
        contenido1_p_1: 'La Atención Primaria de Salud (APS) es un enfoque integral de la salud que tiene como objetivo garantizar el bienestar de las personas a lo largo de toda su vida, desde la promoción de la salud y la prevención de enfermedades hasta el tratamiento, la rehabilitación y los cuidados paliativos. Su propósito es asegurar una distribución equitativa de la salud, brindando atención centrada en las necesidades de las personas lo más cerca posible de su entorno cotidiano.',
        contenido1_h2_2: 'Equidad en Salud',
        contenido1_p_2: 'La APS promueve la justicia social, la equidad y la solidaridad, considerando que el acceso al más alto nivel posible de salud es un derecho fundamental para todos. Para lograr la cobertura sanitaria universal (CSU), los sistemas de salud deben centrarse en las personas y trabajar con su participación, extendiendo la salud a todas las políticas y abordando los determinantes sociales de la salud.',
        
        contenido2_h3: 'La APS tiene tres componentes interdependientes y sinérgicos',
        contenido2_li_1_strong: 'Servicios de salud integrados: ',
        contenido2_li_1_text: 'Cubriendo funciones de atención primaria y salud pública.',
        contenido2_li_2_strong: 'políticas:',
        contenido2_li_2_text: 'Dirigidas a abordar los determinantes más amplios de la salud.',
        contenido2_li_3_strong: 'Empoderamiento comunitario:',
        contenido2_li_3_text: ' personas, familias y comunidades para fomentar la participación social y mejorar la autosuficiencia en salud.',

        contenido3_h3: 'La Atención Primaria de Salud (APS) es crucial por varias razones',
        contenido3_li_1_strong: 'Inclusividad y equidad:',
        contenido3_li_1_text: ' La APS es el enfoque más inclusivo y equitativo para mejorar la salud física, mental y social, garantizando el acceso a todos los sectores de la población, especialmente a los más vulnerables.',
        contenido3_li_2_strong: 'Mejora de la equidad en salud:',
        contenido3_li_2_text: ' Las inversiones en APS ayudan a mejorar el acceso a los servicios de salud, reduciendo las desigualdades en la atención sanitaria y mejorando los resultados de salud.',
        contenido3_li_3_strong: 'Rentabilidad y eficiencia:',
        contenido3_li_3_text: ' Invertir en APS es rentable y mejora eficientemente el rendimiento del sistema de salud, optimizando los recursos y reduciendo los costes a largo plazo.',
        contenido3_li_4_strong: 'Resiliencia en tiempos de crisis:',
        contenido3_li_4_text: ' La APS permite que los sistemas de salud sean más resilientes durante las crisis, como la pandemia de COVID-19. Ayuda a detectar los primeros signos de epidemias y permite una respuesta más rápida a los aumentos de la demanda de servicios.',
        contenido3_li_5_strong: 'Factores sociales y ambientales:',
        contenido3_li_5_text: ' La APS reconoce que la salud no depende solo de los servicios médicos, sino también de factores como la educación, la protección social, los sistemas alimentarios y el medio ambiente, todos ellos clave para el bienestar general.',
        
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
        footer_link_internet: 'Internet',
        footer_link_news: 'Agencias de noticias',
        footer_link_data: 'Alternativa de datos',
        footer_link_media: 'Medios',
        footer_link_defamation: 'Difamación',
        footer_recent_posts_h3: 'Publicaciones recientes',
      },
      en: {
        // Título de la página
        pageTitle: 'Primary Health Care',

        // Barra superior y navegación
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Features and Benefits',
        aboutNav: 'About Us',
        blogNav: 'Blog',

        // Imágenes principales y de contenido
        image_act_now: 'Act_now.webp', 
        image_primary_health: 'primary_health.webp', 

        // Contenido Principal
        contenido1_h2_1: 'Preventive Care',
        contenido1_p_1: 'Primary Health Care (PHC) is a comprehensive health approach that aims to guarantee the well-being of individuals throughout their entire life, from health promotion and disease prevention to treatment, rehabilitation, and palliative care. Its purpose is to ensure an equitable distribution of health, providing care centered on the needs of individuals as close as possible to their everyday environment.',
        contenido1_h2_2: 'Health Equity',
        contenido1_p_2: 'PHC promotes social justice, equity, and solidarity, considering that access to the highest attainable level of health is a fundamental right for all. To achieve universal health coverage (UHC), health systems must focus on individuals and work with their participation, extending health into all policies and addressing the social determinants of health.',
        
        contenido2_h3: 'PHC has three interdependent and synergistic components',
        contenido2_li_1_strong: 'Integrated health services: ',
        contenido2_li_1_text: 'Covering primary and public health functions.',
        contenido2_li_2_strong: 'policies:',
        contenido2_li_2_text: 'Aimed at addressing the broader determinants of health.',
        contenido2_li_3_strong: 'Community empowerment:',
        contenido2_li_3_text: 'people, families, and communities to foster social participation and improve self-sufficiency in health.',

        contenido3_h3: 'Primary Health Care (PHC) is crucial for several reasons',
        contenido3_li_1_strong: 'Inclusivity and equity:',
        contenido3_li_1_text: 'PHC is the most inclusive and equitable approach to improving physical, mental, and social health, ensuring access to all sectors of the population, especially the most vulnerable.',
        contenido3_li_2_strong: 'Improvement of health equity:',
        contenido3_li_2_text: 'Investments in PHC help improve access to health services, reducing inequalities in healthcare and improving health outcomes.',
        contenido3_li_3_strong: 'Cost-effectiveness and efficiency:',
        contenido3_li_3_text: 'Investing in PHC is cost-effective and efficiently improves health system performance, optimizing resources and reducing long-term costs.',
        contenido3_li_4_strong: 'Resilience in times of crisis:',
        contenido3_li_4_text: 'PHC enables health systems to be more resilient during crises, such as the COVID-19 pandemic. It helps detect early signs of epidemics and allows for a quicker response to increases in service demand.',
        contenido3_li_5_strong: 'Social and environmental factors:',
        contenido3_li_5_text: 'PHC acknowledges that health depends not only on medical services but also on factors like education, social protection, food systems, and the environment — all of which are key to overall well-being.',
        
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
      document.title = texts.pageTitle;

      // Cambiar placeholder del buscador
      const searchInput = document.querySelector('.busqueda input');
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
      
      // Traducción de imágenes principales
document.querySelectorAll('img[data-image-key]').forEach(img => {
  const imageKey = img.getAttribute('data-image-key');
  const imageFile = texts[imageKey];

  console.log(`🔍 Imagen para "${imageKey}":`, imageFile);  // Diagnóstico útil

  if (imageFile) {
    img.src = `/static/images/${imageFile}`;
  } else {
    console.warn(`⚠️ No se encontró imagen para "${imageKey}"`);
  }
});

      // Contenido1
      const contenido1_h2_1 = document.querySelector('h2[data-text-key="contenido1_h2_1"]');
      if(contenido1_h2_1) contenido1_h2_1.textContent = texts.contenido1_h2_1;
      
      const contenido1_p_1 = document.querySelector('p[data-text-key="contenido1_p_1"]');
      if(contenido1_p_1) contenido1_p_1.textContent = texts.contenido1_p_1;
      
      const contenido1_h2_2 = document.querySelector('h2[data-text-key="contenido1_h2_2"]');
      if(contenido1_h2_2) contenido1_h2_2.textContent = texts.contenido1_h2_2;
      
      const contenido1_p_2 = document.querySelector('p[data-text-key="contenido1_p_2"]');
      if(contenido1_p_2) contenido1_p_2.textContent = texts.contenido1_p_2;


      // Contenido2
      const contenido2_h3 = document.querySelector('h3[data-text-key="contenido2_h3"]');
      if(contenido2_h3) contenido2_h3.textContent = texts.contenido2_h3;

      const contenido2_lis = document.querySelectorAll('.contenido2 ol li');
      if (contenido2_lis[0]) {
          const strong1 = contenido2_lis[0].querySelector('strong');
          if (strong1) strong1.textContent = texts.contenido2_li_1_strong;
          const span1 = contenido2_lis[0].querySelector('span[data-text-key="contenido2_li_1_text"]');
          if(span1) span1.textContent = texts.contenido2_li_1_text;
      }
      if (contenido2_lis[1]) {
          const strong2 = contenido2_lis[1].querySelector('strong');
          if (strong2) strong2.textContent = texts.contenido2_li_2_strong;
          const span2 = contenido2_lis[1].querySelector('span[data-text-key="contenido2_li_2_text"]');
          if(span2) span2.textContent = texts.contenido2_li_2_text;
      }
      if (contenido2_lis[2]) {
          const strong3 = contenido2_lis[2].querySelector('strong');
          if (strong3) strong3.textContent = texts.contenido2_li_3_strong;
          const span3 = contenido2_lis[2].querySelector('span[data-text-key="contenido2_li_3_text"]');
          if(span3) span3.textContent = texts.contenido2_li_3_text;
      }

      // Contenido3
      const contenido3_h3_elem = document.querySelector('.contenido3 h3[data-text-key="contenido3_h3"]');
      if(contenido3_h3_elem) contenido3_h3_elem.innerHTML = texts.contenido3_h3.replace('\n', '<br>'); // Manejar <br>

      const contenido3_lis = document.querySelectorAll('.contenido3 ul li');
      if (contenido3_lis[0]) {
          const strong = contenido3_lis[0].querySelector('strong');
          if(strong) strong.textContent = texts.contenido3_li_1_strong;
          const span = contenido3_lis[0].querySelector('span[data-text-key="contenido3_li_1_text"]');
          if(span) span.textContent = texts.contenido3_li_1_text;
      }
      if (contenido3_lis[1]) {
          const strong = contenido3_lis[1].querySelector('strong');
          if(strong) strong.textContent = texts.contenido3_li_2_strong;
          const span = contenido3_lis[1].querySelector('span[data-text-key="contenido3_li_2_text"]');
          if(span) span.textContent = texts.contenido3_li_2_text;
      }
      if (contenido3_lis[2]) {
          const strong = contenido3_lis[2].querySelector('strong');
          if(strong) strong.textContent = texts.contenido3_li_3_strong;
          const span = contenido3_lis[2].querySelector('span[data-text-key="contenido3_li_3_text"]');
          if(span) span.textContent = texts.contenido3_li_3_text;
      }
      if (contenido3_lis[3]) {
          const strong = contenido3_lis[3].querySelector('strong');
          if(strong) strong.textContent = texts.contenido3_li_4_strong;
          const span = contenido3_lis[3].querySelector('span[data-text-key="contenido3_li_4_text"]');
          if(span) span.textContent = texts.contenido3_li_4_text;
      }
      if (contenido3_lis[4]) {
          const strong = contenido3_lis[4].querySelector('strong');
          if(strong) strong.textContent = texts.contenido3_li_5_strong;
          const span = contenido3_lis[4].querySelector('span[data-text-key="contenido3_li_5_text"]');
          if(span) span.textContent = texts.contenido3_li_5_text;
      }

      // Traducir el título del reproductor de medios
      const mediaPlayerTitle = document.querySelector('h2[data-text-key="media_player_title"]');
      if (mediaPlayerTitle) mediaPlayerTitle.textContent = texts.media_player_title;
      const mediaAudioTitle = document.querySelector('h3[data-text-key="media_audio_title"]');
      if (mediaAudioTitle) mediaAudioTitle.textContent = texts.media_audio_title;


      // Pie de página (no se altera en JS)
      const footerColumns = document.querySelectorAll('.main-footer .footer-column');
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

  // Lógica del reproductor de audio
  const audio = document.getElementById('myAudio');
  if (audio) { // Asegurarse de que el elemento de audio existe
      const playPauseBtn = document.querySelector('.play-pause-btn');
      const playIcon = playPauseBtn.querySelector('.fa-play');
      const pauseIcon = document.createElement('i');
      pauseIcon.classList.add('fas', 'fa-pause');

      const progressBar = document.querySelector('.progress-bar');
      const currentTimeSpan = document.querySelector('.current-time');
      const durationSpan = document.querySelector('.duration');

      const volumeBtn = document.querySelector('.volume-btn');
      const volumeBar = document.querySelector('.volume-bar');

      let isDraggingProgressBar = false;

      function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      }

      playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play();
          playPauseBtn.innerHTML = '';
          playPauseBtn.appendChild(pauseIcon);
        } else {
          audio.pause();
          playPauseBtn.innerHTML = '';
          playPauseBtn.appendChild(playIcon);
        }
      });

      audio.addEventListener('timeupdate', () => {
        if (!isDraggingProgressBar) {
          const progress = (audio.currentTime / audio.duration) * 100;
          progressBar.value = progress;
          currentTimeSpan.textContent = formatTime(audio.currentTime);
        }
      });

      audio.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audio.duration);
        volumeBar.value = audio.volume * 100;
      });

      audio.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '';
        playPauseBtn.appendChild(playIcon);
        audio.currentTime = 0;
        progressBar.value = 0;
        currentTimeSpan.textContent = formatTime(0);
      });

      progressBar.addEventListener('mousedown', () => {
        isDraggingProgressBar = true;
      });

      progressBar.addEventListener('mouseup', () => {
        isDraggingProgressBar = false;
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
      });

      progressBar.addEventListener('input', () => {
        if (isDraggingProgressBar) {
          currentTimeSpan.textContent = formatTime((progressBar.value / 100) * audio.duration);
        }
      });

      volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value / 100;
        updateVolumeIcon();
      });

      volumeBtn.addEventListener('click', () => {
        if (audio.muted) {
          audio.muted = false;
          volumeBar.value = audio.volume * 100;
        } else {
          audio.muted = true;
          volumeBar.value = 0;
        }
        updateVolumeIcon();
      });

      function updateVolumeIcon() {
        if (audio.muted || audio.volume === 0) {
          volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (audio.volume < 0.5) {
          volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
          volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
      }

      updateVolumeIcon();
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
