// ============================================================================================================
// Clase AnimationController: Gestiona las animaciones de elementos al hacer scroll y hover
// (Unificado de journall3.js y otras animaciones)
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
        // Configuración de los elementos a animar
        const elementsConfig = [
            // Selectores para tercerapagina.html
            { selector: 'h1[data-text-key="h1_main_title"]', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.about-section', animation: 'custom', direction: 'stagger' },
            { selector: '.mission-section', animation: 'custom', direction: 'stagger' },
            { selector: '.purpose-section:first-of-type', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: 'img[data-image-key="image_privacy"]', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.purpose-section:nth-of-type(2)', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.teams-section', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.media-player-section', animation: 'fadeInUp', direction: 'up', distance: 40 }, // Sección del reproductor de medios
            { selector: '.main-footer', animation: 'fadeInUp', direction: 'up', distance: 40 }
        ];

        elementsConfig.forEach(config => {
            const element = document.querySelector(config.selector);
            if (element) {
                this.prepareElement(element, config); // Prepara el estilo inicial del elemento
                this.observer.observe(element); // Empieza a observar el elemento
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
                this.prepareStaggerElement(element); // Prepara los hijos para animación escalonada
                break;
            default:
                element.style.transform = `translateY(${config.distance || 20}px)`;
        }
    }

    // Prepara los elementos hijos para una animación escalonada
    prepareStaggerElement(element) {
        // Selecciona todos los elementos de texto e imágenes dentro del contenedor
        const children = element.querySelectorAll('h1, h2, h3, p, ul, ol, li, img, .team-card'); // Incluye team-card
        children.forEach((child, index) => {
            child.style.opacity = '0'; // Inicialmente oculto
            // Aplica transformaciones iniciales para efectos de entrada
            if (child.tagName === 'IMG' || child.classList.contains('team-card')) {
                child.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)'; // Imágenes y team cards
            } else {
                child.style.transform = 'translateY(20px)'; // Textos
            }
            child.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            child.dataset.staggerIndex = index; // Almacena el índice para el retardo
        });
    }

    // Anima un elemento dependiendo de su tipo de animación
    animateElement(element) {
        const animationType = element.dataset.animationType;
        if (animationType === 'custom') {
            this.animateStaggerElement(element);
        } else {
            this.animateStandardElement(element);
        }
        // No se llama a animateListItems aquí, ya que no hay listas que necesiten stagger específico en los contenedores principales observados
    }

    // Anima un elemento con una transición estándar (fade in y translate)
    animateStandardElement(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)'; // Vuelve a la posición original
            if (element.dataset.animationType && element.dataset.animationType.includes('animate__')) {
                element.classList.add('animate__animated', element.dataset.animationType);
            }
        });
    }

    // Anima elementos hijos de forma escalonada
    animateStaggerElement(element) {
        element.style.opacity = '1'; // Asegura que el contenedor principal sea visible
        const children = element.querySelectorAll('[data-stagger-index]');
        children.forEach((child, index) => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateX(0)'; // Vuelve a la posición original
                });
            }, index * 150); // Retardo escalonado
        });
    }

    // Anima elementos de lista (ol, ul) de forma escalonada
    // Se mantiene por si se añaden listas a elementos observados
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

    // Función genérica para animación escalonada de elementos de lista
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
            }, index * delay + 300); // Retardo con un offset inicial
        });
    }

    // Anima el encabezado de la página al cargar
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

    // Configura los event listeners para scroll y redimensionado, y animaciones de hover
    setupEventListeners() {
        let ticking = false; // Bandera para optimizar el evento scroll
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // this.handleScroll(); // No es necesario si el observer ya hace todo
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        this.setupHoverAnimations();

        window.addEventListener('resize', this.debounce(() => {
            // this.handleResize(); // No es necesario si no hay lógica de resize de animación
        }, 250));
    }

    // Configura animaciones de hover para botones y enlaces de navegación
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
            // Esto es para que el boton rebote
            button.addEventListener('click', () => {
                button.classList.add('click-bounce');
                setTimeout(() => {
                    button.classList.remove('click-bounce');
                }, 300);
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

        // Funcionalidad para las tarjetas del equipo (con efecto flip)
        document.querySelectorAll('.team-card').forEach(card => {
            // Asegúrate de que el inner card sea el que rota
            const cardInner = card.querySelector('.card-inner');
            if (cardInner) {
                card.addEventListener('mouseenter', () => {
                    cardInner.style.transform = 'rotateY(180deg)';
                });
                card.addEventListener('mouseleave', () => {
                    cardInner.style.transform = 'rotateY(0deg)';
                });
            }
        });
    }

    // Función debounce para limitar la frecuencia de ejecución de funciones (ej. en resize)
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Desconecta el observer y limpia elementos animados al destruir el controlador
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animatedElements.clear();
    }

    // Permite añadir dinámicamente elementos a observar
    addElement(selector, config) {
        const element = document.querySelector(selector);
        if (element) {
            this.prepareElement(element, config);
            this.observer.observe(element);
        }
    }
}

// Instancia global del controlador de animaciones
const animationController = new AnimationController();
window.AnimationController = animationController;


// ============================================================================================================
// Lógica de Traducción y Menú de Idiomas
// ============================================================================================================

document.addEventListener('DOMContentLoaded', function() {
  const languageDropdownDiv = document.querySelector('.language-dropdown');
  let languageButton = null;
  let languageMenu = null;
  let dropdownItems = null;

  // Verifica si el contenedor del dropdown existe antes de intentar acceder a sus hijos
  if (languageDropdownDiv) {
      languageButton = languageDropdownDiv.querySelector('.boton-idioma');
      languageMenu = languageDropdownDiv.querySelector('.dropdown-menu');
      dropdownItems = languageDropdownDiv.querySelectorAll('.dropdown-item');

      // Solo si todos los elementos necesarios existen, añade los event listeners
      if (languageButton && languageMenu && dropdownItems.length > 0) {
          languageButton.addEventListener('click', function(e) {
              e.stopPropagation(); // Evita que el clic se propague al documento
              languageMenu.classList.toggle('show'); // Alterna la clase 'show'
          });
          
          // Cerrar menú al hacer clic fuera del dropdown
          document.addEventListener('click', function(e) {
              if (!languageDropdownDiv.contains(e.target)) { // Usa el contenedor principal del dropdown
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
                  e.preventDefault(); // Previene el comportamiento por defecto del enlace
                  const selectedLang = this.getAttribute('data-lang');
                  
                  console.log('Idioma seleccionado:', selectedLang); // Para debugging
                  
                  languageMenu.classList.remove('show'); // Cerrar el menú
                  
                  changeLanguage(selectedLang); // Cambiar el idioma de la página
                  
                  localStorage.setItem('selectedLanguage', selectedLang); // Guardar preferencia
              });
          });
      } else {
          console.warn("Elementos del dropdown de idioma no encontrados, la funcionalidad de traducción no se inicializará completamente.");
      }
  }


  function changeLanguage(lang) {
    const translations = {
      es: {
        // Título de la página
        pageTitle: 'Company Info', // Título para esta página
        
        // Barra superior y navegación
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',

        // Contenido Principal
        about_tag_1: 'Cariñoso',
        about_tag_2: 'Accesible',
        about_tag_3: 'Empoderador',
        about_h2: 'Acerca de Nuestra Empresa e Historia',
        about_p1: 'En Health Connectors, somos un sitio web desarrollado por el equipo Gürteltier, dedicado a mejorar el acceso a servicios de atención médica de calidad. Nuestro equipo está formado por profesionales de campos como la tecnología, la atención médica y la gestión, trabajando juntos para crear una plataforma innovadora que conecta a pacientes, proveedores y empresas en el sector de la salud.',
        about_p2: 'Nuestro objetivo es simplificar el proceso de búsqueda de atención médica, haciéndola más accesible y eficiente para los usuarios al mismo tiempo que promovemos el bienestar de las comunidades a las que servimos. Al aprovechar la tecnología de vanguardia, nos aseguramos de que las soluciones de salud estén al alcance de todos.',
        image_appointment: 'about_uno_esp.webp', // Asume versión en español

        mission_h2: 'Nuestra misión',
        mission_p1: 'Nuestra misión es revolucionar el acceso a la atención médica creando un ecosistema digital donde pacientes, profesionales de la salud e instituciones estén conectados sin problemas. Nos comprometemos a eliminar las barreras a la atención —como ineficiencias, falta de coordinación y acceso limitado— a través de una plataforma segura, intuitiva e inclusiva.',
        mission_p2: 'Al empoderar a las personas para que gestionen su salud y apoyar a los proveedores con herramientas inteligentes, nuestro objetivo es construir una experiencia de atención médica que sea eficiente, centrada en el ser humano y enfocada en mejorar el bienestar de cada comunidad a la que servimos.',
        image_mission: 'chica_verde.webp', // Asume versión en español

        purpose_h2: 'Nuestro propósito principal',
        purpose_p1: 'En Health Connectors, nos enfocamos principalmente en facilitar que las personas organicen citas médicas desde la comodidad de sus hogares. A través de nuestra plataforma, los usuarios pueden conectarse con proveedores de atención médica, programar consultas y gestionar sus citas médicas de manera eficiente.',
        purpose_p2: 'Además, ofrecemos una gama de recursos relacionados con la salud, como consejos de bienestar y orientación, para apoyar a los usuarios en el mantenimiento de su salud general. Al simplificar el proceso de citas y proporcionar información valiosa sobre la salud, garantizamos que el acceso a la atención sea conveniente y completo, mejorando la experiencia general de atención médica.',
        
        image_privacy: 'about_tres_esp.webp', // Asume versión en español

        groups_h2: 'Descubre más sobre nuestros grupos de trabajo',
        groups_p: 'En Health Connectors, nuestro trabajo es impulsado por cuatro equipos especializados que colaboran para construir una experiencia de atención médica fluida:',

        // Nombres de los equipos y miembros - Imágenes y texto
        team_bg_design: 'morasporsiacaso.webp',
        team_title_design: 'about_design_letra_esp.webp',
        team_names_design: 'about_design_nombres.webp', // Asumo que tienes una imagen traducida
        
        team_bg_htmlcss: 'cerezas.webp',
        team_title_htmlcss: 'about_css_letra_esp.webp',
        team_names_htmlcss: 'about_html_nombres.webp', // Asumo que tienes una imagen traducida
        
        team_bg_javascript: 'moritas.webp',
        team_title_javascript: 'about_js_letra_esp.webp',
        team_names_javascript: 'about_java_nombres.webp', // Asumo que tienes una imagen traducida
        
        team_bg_database: 'fresita.webp',
        team_title_database: 'about_database_letra_esp.webp',
        team_names_database: 'about_database_nombres.webp', // Asumo que tienes una imagen traducida
        
        // Sección del reproductor de medios
        media_player_title: 'Nuestros Podcasts',
        media_audio_title: 'Canción SoundHelix 1 (Ejemplo de Podcast)',


        // Pie de página
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
        // Título de la página
        pageTitle: 'Company Info',
        
        // Barra superior y navegación
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Functions and Benefits',
        aboutNav: 'About us',
        blogNav: 'Blog',

        // Contenido Principal
        about_tag_1: 'Caring',
        about_tag_2: 'Accessible',
        about_tag_3: 'Empowering',
        about_h2: 'About Our Company and History',
        about_p1: 'At Health Connectors, we are a website developed by the Gürteltier team, dedicated to improving access to quality healthcare services. Our team consists of professionals from fields such as technology, healthcare, and management, working together to create an innovative platform that connects patients, providers, and businesses in the healthcare sector.',
        about_p2: 'We aim to simplify the process of finding medical care, making it more accessible and efficient for users while promoting the well-being of the communities we serve. By leveraging cutting-edge technology, we ensure that health solutions are within reach for everyone.',
        image_appointment: 'appoitment.webp',

        mission_h2: 'Our mission',
        mission_p1: 'Our mission is to revolutionize access to healthcare by creating a digital ecosystem where patients, healthcare professionals, and institutions are seamlessly connected. We are committed to eliminating barriers to care—such as inefficiencies, lack of coordination, and limited access—through a secure, intuitive, and inclusive platform.',
        mission_p2: 'By empowering individuals to manage their health and supporting providers with smart tools, we aim to build a healthcare experience that is efficient, human-centered, and focused on improving the well-being of every community we serve.',
        image_mission: 'chica_verde.webp',

        purpose_h2: 'Our principal purpose',
        purpose_p1: 'At Health Connectors, we primarily focus on making it easy for individuals to organize medical appointments from the comfort of their homes. Through our platform, users can connect with healthcare providers, schedule consultations, and manage their medical appointments efficiently.',
        purpose_p2: 'Additionally, we offer a range of health-related resources, such as wellness tips and guidance, to support users in maintaining their overall health. By streamlining the appointment process and providing valuable health information, we ensure that access to care is both convenient and comprehensive, enhancing the overall healthcare experience.',
        
        image_privacy: 'your_privacy.webp',

        groups_h2: 'Discover more about our work groups',
        groups_p: 'At Health Connectors, our work is driven by four specialized teams that collaborate to build a seamless healthcare experience:',

        // Nombres de los equipos y miembros - Imágenes y texto
        team_bg_design: 'morasporsiacaso.webp',
        team_title_design: 'letter_design.webp',
        team_names_design: 'about_design_nombres.webp',
        
        team_bg_htmlcss: 'cerezas.webp',
        team_title_htmlcss: 'css_letter.webp',
        team_names_htmlcss: 'about_html_nombres.webp',
        
        team_bg_javascript: 'moritas.webp',
        team_title_javascript: 'java_letras.webp',
        team_names_javascript: 'about_java_nombres.webp',
        
        team_bg_database: 'fresita.webp',
        team_title_database: 'base_letter.webp',
        team_names_database: 'about_database_nombres.webp',

        // Pie de página
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
      // Traducir el título de la página
      const pageTitleElement = document.querySelector('title[data-text-key="pageTitle"]');
      if (pageTitleElement) pageTitleElement.textContent = texts.pageTitle;

      // Cambiar placeholder del buscador
      const searchInput = document.querySelector('input[data-text-key="searchPlaceholder"]');
      if (searchInput) searchInput.placeholder = texts.searchPlaceholder;

      // Manejo de botones de login/registro o dropdown "Mi Cuenta"
      const registerButton = document.querySelector('button[data-text-key="registerButton"]');
      if (registerButton) registerButton.textContent = texts.registerButton;

      const loginButton = document.querySelector('button[data-text-key="loginButton"]');
      if (loginButton) loginButton.textContent = texts.loginButton;

      const myAccountButton = document.querySelector('button[data-text-key="myAccountButton"]');
      if (myAccountButton) myAccountButton.textContent = texts.myAccountButton;

      const profileLink = document.querySelector('a[data-text-key="profileLink"]');
      if (profileLink) profileLink.textContent = texts.profileLink;

      const logoutLink = document.querySelector('a[data-text-key="logoutLink"]');
      if (logoutLink) logoutLink.textContent = texts.logoutLink;

      // Navegación principal
      document.querySelectorAll('nav ul li a[data-nav-key]').forEach(link => {
          const key = link.getAttribute('data-nav-key');
          if (key && texts[key]) link.textContent = texts[key];
      });

      // Contenido principal: Mancha Heath Connectors
      const homeHeaderImage = document.querySelector('img[data-image-key="home_header_image"]');
      if (homeHeaderImage) homeHeaderImage.src = texts.home_header_image;

      const healthConnectorsTitlePart1 = document.querySelector('h1[data-text-key="health_connectors_title_part1"]');
      const healthConnectorsTitlePart2 = document.querySelector('b[data-text-key="health_connectors_title_part2"]');
      if (healthConnectorsTitlePart1 && healthConnectorsTitlePart2) {
          healthConnectorsTitlePart1.innerHTML = texts.health_connectors_title_part1 + '<br />';
          healthConnectorsTitlePart2.textContent = texts.health_connectors_title_part2;
      }
      const healthConnectorsP1 = document.querySelector('p[data-text-key="health_connectors_p1"]');
      if (healthConnectorsP1) healthConnectorsP1.textContent = texts.health_connectors_p1;
      const healthConnectorsP2 = document.querySelector('p[data-text-key="health_connectors_p2"]');
      if (healthConnectorsP2) healthConnectorsP2.textContent = texts.health_connectors_p2;
      const findDoctorButton = document.querySelector('button[data-text-key="find_doctor_button"]');
      if (findDoctorButton) findDoctorButton.textContent = texts.find_doctor_button;

      // Carrusel 1: Servicios destacados
      const featuredServicesTitle = document.querySelector('h1[data-text-key="featured_services_title"]');
      if (featuredServicesTitle) featuredServicesTitle.textContent = texts.featured_services_title;

      // Iterar sobre los swiper-slides para traducir sus imágenes y texto
      document.querySelectorAll('.swiper-slide').forEach((slide, index) => {
          const imageElement = slide.querySelector('img');
          const imageKey = 'service_image' + (index + 1); // service_image1, service_image2, etc.
          if (imageElement && texts[imageKey]) {
              imageElement.src = texts[imageKey];
          }

          const titleElement = slide.querySelector('h4');
          const titleKey = 'service' + (index + 1) + '_title';
          if (titleElement && texts[titleKey]) {
              titleElement.textContent = texts[titleKey];
          }

          const descElement = slide.querySelector('p');
          const descKey = 'service' + (index + 1) + '_description';
          if (descElement && texts[descKey]) {
              descElement.textContent = texts[descKey];
          }
      });

      // Sección "Are you having some problems?"
      const troubleH3 = document.querySelector('h3[data-text-key="trouble_h3"]');
      if (troubleH3) troubleH3.textContent = texts.trouble_h3;
      const troubleButton = document.querySelector('button[data-text-key="trouble_button"]');
      if (troubleButton) troubleButton.textContent = texts.trouble_button;
      const troubleImage = document.querySelector('img[data-image-key="trouble_image"]');
      if (troubleImage) troubleImage.src = texts.trouble_image;

      // Carrusel 2: Journal
      const journalH2 = document.querySelector('h2[data-text-key="journal_h2"]');
      if (journalH2) journalH2.innerHTML = texts.journal_h2; // Using innerHTML for <br />
      const journalP = document.querySelector('p[data-text-key="journal_p"]');
      if (journalP) journalP.textContent = texts.journal_p;

      document.querySelectorAll('section .container2 .card').forEach((card, index) => {
          const imageElement = card.querySelector('img');
          const imageKey = 'journal_card_image' + (index + 1);
          if (imageElement && texts[imageKey]) {
              imageElement.src = texts[imageKey];
          }

          const titleElement = card.querySelector('h3');
          const titleKey = 'journal_card_title' + (index + 1);
          if (titleElement && texts[titleKey]) {
              titleElement.textContent = texts[titleKey];
          }

          const descElement = card.querySelector('p');
          const descKey = descElement ? descElement.getAttribute('data-text-key') : null; // Get key from p
          if (descElement && descKey && texts[descKey]) {
            descElement.textContent = texts[descKey];
          } else if (descElement && !descKey) { // If p has no data-text-key but needs translation (e.g., dynamic content)
            // No direct translation for this p if it's dynamic
          }
      });

      // Testimonios
      const testimonialsH3 = document.querySelector('h3[data-text-key="testimonials_h3"]');
      if (testimonialsH3) {
          const span = testimonialsH3.querySelector('span[data-text-key="testimonials_span"]');
          if (span) {
              span.textContent = texts.testimonials_span;
              testimonialsH3.innerHTML = texts.testimonials_h3.replace('<span data-text-key="testimonials_span">from our users</span>', span.outerHTML);
          } else {
              testimonialsH3.textContent = texts.testimonials_h3;
          }
      }
      const testimonialsBlockquote = document.querySelector('blockquote[data-text-key="testimonials_blockquote"]');
      if (testimonialsBlockquote) testimonialsBlockquote.innerHTML = texts.testimonials_blockquote;

      // Who we are image
      const whoWeAreImage = document.querySelector('img[data-image-key="who_we_are_image"]');
      if (whoWeAreImage) whoWeAreImage.src = texts.who_we_are_image;

      // Contact form
      const contactH2Container = document.querySelector('h2[data-text-key="contact_h2"]');
      const contactH2GetIn = contactH2Container ? contactH2Container.querySelector('#color-container[data-text-key="contact_get_in"]') : null;
      const contactH2Touch = contactH2Container ? contactH2Container.querySelector('.get-touch[data-text-key="contact_touch"]') : null;
      if (contactH2GetIn) contactH2GetIn.textContent = texts.contact_get_in;
      if (contactH2Touch) contactH2Touch.textContent = texts.contact_touch;
      
      const contactNamePlaceholder = document.querySelector('input[data-text-key="contact_name_placeholder"]');
      if (contactNamePlaceholder) contactNamePlaceholder.placeholder = texts.contact_name_placeholder;
      const contactEmailPlaceholder = document.querySelector('input[data-text-key="contact_email_placeholder"]');
      if (contactEmailPlaceholder) contactEmailPlaceholder.placeholder = texts.contact_email_placeholder;
      const contactMessagePlaceholder = document.querySelector('textarea[data-text-key="contact_message_placeholder"]');
      if (contactMessagePlaceholder) contactMessagePlaceholder.placeholder = texts.contact_message_placeholder;
      const contactSubmitButton = document.querySelector('button[data-text-key="contact_submit_button"]');
      if (contactSubmitButton) contactSubmitButton.textContent = texts.contact_submit_button;
      const contactImage = document.querySelector('img[data-image-key="contact_image"]');
      if (contactImage) contactImage.src = texts.contact_image;

      // Footer
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
      
      // Footer links
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
      
      // Translate recent posts links (example for specific structure)
      const recentPostsLIs = document.querySelectorAll('footer .recent-posts ul li[data-text-key]');
      if (recentPostsLIs[0]) {
          const link = recentPostsLIs[0].querySelector('a');
          const textKey = recentPostsLIs[0].getAttribute('data-text-key');
          if (link && texts[textKey]) link.textContent = texts[textKey];
      }
      if (recentPostsLIs[1]) {
          const link = recentPostsLIs[1].querySelector('a');
          const textKey = recentPostsLIs[1].getAttribute('data-text-key');
          if (link && texts[textKey]) link.textContent = texts[textKey];
      }
      if (recentPostsLIs[2]) {
          const link = recentPostsLIs[2].querySelector('a');
          const textKey = recentPostsLIs[2].getAttribute('data-text-key');
          if (link && texts[textKey]) link.textContent = texts[textKey];
      }
      if (recentPostsLIs[3]) {
          const link = recentPostsLIs[3].querySelector('a');
          const textKey = recentPostsLIs[3].getAttribute('data-text-key');
          if (link && texts[textKey]) link.textContent = texts[textKey];
      }

//para imagenes



      document.querySelectorAll('img[data-image-key]').forEach(img => {
  const imageKey = img.getAttribute('data-image-key');
  const imageFile = texts[imageKey];

  console.log(` Imagen detectada: ${imageKey} → ${imageFile}`);

  if (imageFile) {
    img.src = `/static/images/${imageFile}`;
  } else {
    console.warn(` Imagen no encontrada para "${imageKey}"`);
  }

  

  
});
//para textos
document.querySelectorAll('[data-text-key]').forEach(el => {
  const key = el.getAttribute('data-text-key');
  console.log('🔤 Traduciendo', key, '→', texts[key]); // 👈

  if (texts[key]) {
    if (texts[key].includes('<br>') || texts[key].includes('</')) {
      el.innerHTML = texts[key];
    } else {
      el.textContent = texts[key];
    }
  }
});


      document.documentElement.lang = lang;
  }
}

// Carga inicial del idioma
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


