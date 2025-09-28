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
        // Configuración de los elementos a animar, incluyendo su selector, tipo de animación y dirección
        const elementsConfig = [
            { selector: '.imagen_principal:first-of-type', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.contenido', animation: 'custom', direction: 'stagger' }, // Contenido con animación escalonada
            { selector: '.imagen_principal:nth-of-type(2)', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.contenido_2', animation: 'fadeInUp', direction: 'up', distance: 40 }, 
            { selector: '.contenido_3', animation: 'fadeInRight', direction: 'right', distance: 50 },
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
        // Selecciona todos los elementos de texto dentro del contenedor
        const children = element.querySelectorAll('h1, h2, h3, p, ul, li'); // Incluye ul y li
        children.forEach((child, index) => {
            child.style.opacity = '0'; // Inicialmente oculto
            // Alterna la dirección inicial de la transformación para un efecto de "zig-zag"
            child.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
            child.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out'; // Transición suave
            child.dataset.staggerIndex = index; // Almacena el índice para el retardo
        });
    }

    // Anima un elemento dependiendo de su tipo de animación
    animateElement(element) {
        const animationType = element.dataset.animationType;
        if (animationType === 'custom') {
            this.animateStaggerElement(element); // Llama a la animación escalonada
        } else {
            this.animateStandardElement(element); // Llama a la animación estándar
        }
        // También anima elementos de lista si existen dentro del elemento principal
        this.animateListItems(element);
    }

    // Anima un elemento con una transición estándar (fade in y translate)
    animateStandardElement(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)'; // Vuelve a la posición original
            // Si usa clases de Animate.css, las añade
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
    animateListItems(element) {
        // Animar elementos de listas ordenadas (ol li)
        const olItems = element.querySelectorAll('ol li');
        if (olItems.length > 0 && !element.hasAttribute('data-ol-animated')) {
            element.setAttribute('data-ol-animated', 'true'); // Marca para evitar doble animación
            this.staggerAnimate(olItems, 200, 'translateX(-20px)'); // Retardo y transformación inicial
        }

        // Animar elementos de listas no ordenadas (ul li)
        const ulItems = element.querySelectorAll('ul li');
        if (ulItems.length > 0 && !element.hasAttribute('data-ul-animated')) {
            element.setAttribute('data-ul-animated', 'true'); // Marca para evitar doble animación
            this.staggerAnimate(ulItems, 150, 'translateY(20px)'); // Retardo y transformación inicial
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
                    this.handleScroll(); // Llama a la función de manejo de scroll
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true }); // Usar { passive: true } para mejorar el rendimiento del scroll

        this.setupHoverAnimations(); // Configura animaciones de hover

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize(); // Llama a la función de manejo de redimensionado
        }, 250));
    }

    // Función de manejo de scroll (puede estar vacía si el observer hace todo el trabajo)
    handleScroll() {}

    // Función de manejo de redimensionado
    handleResize() {}

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
  // Elementos del menú de idioma
  const languageButton = document.getElementById('language-button');
  const languageMenu = document.getElementById('language-menu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  
  // Alternar la visibilidad del menú al hacer clic en el botón de idioma
  languageButton.addEventListener('click', function(e) {
    e.stopPropagation(); // Evita que el clic se propague al documento
    languageMenu.classList.toggle('show'); // Alterna la clase 'show'
  });
  
  // Cerrar el menú si se hace clic fuera de él
  document.addEventListener('click', function(e) {
    if (!languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
      languageMenu.classList.remove('show');
    }
  });
  
  // Cerrar el menú al presionar la tecla 'Escape'
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      languageMenu.classList.remove('show');
    }
  });
  
  // Manejar la selección de idioma desde los elementos del menú
  dropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault(); // Previene el comportamiento por defecto del enlace
      const selectedLang = this.getAttribute('data-lang'); // Obtiene el idioma del atributo data-lang
      
      console.log('Idioma seleccionado:', selectedLang); // Para depuración
      
      languageMenu.classList.remove('show'); // Cierra el menú
      
      changeLanguage(selectedLang); // Cambia el idioma de la página
      
      localStorage.setItem('selectedLanguage', selectedLang); // Guarda la preferencia en el almacenamiento local
    });
  });
  
  // Función principal para cambiar el idioma de todos los textos e imágenes en la página
  function changeLanguage(lang) {
    // Objeto con todas las traducciones y rutas de imagen
    const translations = {
      es: {
        // Título de la página
        pageTitle: 'Factores de Riesgo e Intervenciones',

        // Barra superior y navegación
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',

        // Imágenes principales y de contenido
        image_lifestyle_factors: 'factores_esp.webp', // Asume que tienes una versión en español
        image_smoking_risks: 'FUMAR_esp', // Asume que tienes una versión en español
        
        // Contenido Principal
        contenido_h2: 'Factores de Riesgo Abordados',
        contenido_li_1_strong: 'Consumo de tabaco:',
        contenido_li_1_text: ' Fumar aumenta significativamente el riesgo de enfermedades cardíacas y accidentes cerebrovasculares.',
        contenido_li_2_strong: 'Dieta poco saludable:',
        contenido_li_2_text: ' Dietas ricas en grasas saturadas, azúcares y sal, y bajas en frutas y verduras.',
        contenido_li_3_strong: 'Consumo nocivo de alcohol:',
        contenido_li_3_text: ' El consumo excesivo de alcohol puede elevar la presión arterial y contribuir a enfermedades cardíacas.',
        contenido_li_4_strong: 'Inactividad física:',
        contenido_li_4_text: ' La falta de ejercicio regular puede llevar al sobrepeso y otros problemas de salud.',
        contenido_p_1: 'Estos factores están interrelacionados con condiciones fisiológicas como hipertensión, niveles elevados de colesterol y glucosa, y obesidad.',
        
        contenido2_h2: 'Herramientas y Estrategias de Intervención',
        contenido2_li_1_strong: 'Averiguar:',
        contenido2_li_1_text: ' Indagar sobre los hábitos del paciente.',
        contenido2_li_2_strong: 'Aconsejar:',
        contenido2_li_2_text: ' Proporcionar información clara y personalizada.',
        contenido2_li_3_strong: 'Apreciar:',
        contenido2_li_3_text: ' Evaluar la disposición del paciente al cambio.',
        contenido2_li_4_strong: 'Asistir:',
        contenido2_li_4_text: ' Ofrecer apoyo y estrategias para el cambio.',
        contenido2_li_5_strong: 'Acordar:',
        contenido2_li_5_text: ' Programar seguimientos y reforzar el compromiso.',
        contenido2_p_1: 'Además, se enfatiza la técnica de entrevista motivacional como una forma de fomentar el cambio de comportamiento, adaptando las intervenciones al contexto cultural y social del paciente.',

        contenido3_h2: 'Quienes trabajan en esto son',
        contenido3_li_1_strong: 'Profesionales de atención primaria de salud:',
        contenido3_li_1_text: ' Médicos, enfermeras y otros trabajadores de la salud que interactúan directamente con los pacientes.',
        contenido3_li_2_strong: 'Capacitadores:',
        contenido3_li_2_text: ' Responsables de formar al personal sanitario en prevención y control de enfermedades cardiovasculares (ECV).',
        contenido3_li_3_strong: 'Gestores de programas de salud:',
        contenido3_li_3_text: ' Encargados de planificar y supervisar las iniciativas de prevención de enfermedades.',
        
        // Pie de página (no se alterará en el JS)
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
        pageTitle: 'Risk Factors and Interventions',

        // Barra superior y navegación
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Features and Benefits',
        aboutNav: 'About Us',
        blogNav: 'Blog',

        // Imágenes principales y de contenido
        image_lifestyle_factors: 'lifestyle1.webp',
        image_smoking_risks: 'FUMAR.webp',
        
        // Contenido Principal
        contenido_h2: 'Risk Factors Addressed',
        contenido_li_1_strong: 'Tobacco use:',
        contenido_li_1_text: ' Smoking significantly increases the risk of heart disease and strokes.',
        contenido_li_2_strong: 'Unhealthy diet:',
        contenido_li_2_text: ' Diets high in saturated fats, sugars, and salt, and low in fruits and vegetables.',
        contenido_li_3_strong: 'Harmful alcohol consumption:',
        contenido_li_3_text: ' Excessive drinking can raise blood pressure and contribute to heart disease.',
        contenido_li_4_strong: 'Physical inactivity:',
        contenido_li_4_text: ' Lack of regular exercise can lead to overweight and other health issues.',
        contenido_p_1: 'These factors are interrelated with physiological conditions like hypertension, elevated cholesterol and glucose levels, and obesity.',
        
        contenido2_h2: 'Intervention Tools and Strategies',
        contenido2_li_1_strong: 'Find out:',
        contenido2_li_1_text: ' Inquire about the patient’s habits.',
        contenido2_li_2_strong: 'Advise:',
        contenido2_li_2_text: ' Provide clear and personalized information.',
        contenido2_li_3_strong: 'Appreciate:',
        contenido2_li_3_text: ' Assess the patient’s willingness to change.',
        contenido2_li_4_strong: 'Assist:',
        contenido2_li_4_text: ' Offer support and strategies for change.',
        contenido2_li_5_strong: 'Arrange:',
        contenido2_li_5_text: ' Schedule follow-ups and reinforce commitment.',
        contenido2_p_1: 'Additionally, the motivational interviewing technique is emphasized as a way to encourage behavior change, adapting interventions to the patient’s cultural and social context.',

        contenido3_h2: 'Those who work on this are',
        contenido3_li_1_strong: 'Primary healthcare professionals:',
        contenido3_li_1_text: ' Doctors, nurses, and other healthcare workers who interact directly with patients.',
        contenido3_li_2_strong: 'Trainers:',
        contenido3_li_2_text: ' Those responsible for training healthcare staff on prevention and control of cardiovascular diseases (CVD).',
        contenido3_li_3_strong: 'Health program managers:',
        contenido3_li_3_text: ' Those responsible for planning and overseeing disease prevention initiatives.',
        
        // Pie de página (no se alterará en el JS)
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
      const registerButton = document.querySelector('.boton-registro');
      if(registerButton) registerButton.textContent = texts.registerButton;
      
      const loginButton = document.querySelector('.boton-login');
      if(loginButton) loginButton.textContent = texts.loginButton;
      
      // Cambiar navegación
      document.querySelectorAll('.barra-navegacion ul li a').forEach(link => {
        const key = link.getAttribute('data-nav-key');
        if (key && texts[key]) {
            link.textContent = texts[key];
        }
      });
      
      // Traducción de imágenes principales
document.querySelectorAll('img[data-image-key]').forEach(img => {
  const imageKey = img.getAttribute('data-image-key');
  const imageFile = texts[imageKey];

  console.log(`🔍 Imagen para "${imageKey}":`, imageFile);

  if (imageFile) {
    img.src = `/static/images/${imageFile}`;  // ✅ Ruta absoluta correcta
  } else {
    console.warn(`⚠️ Imagen no encontrada para "${imageKey}"`);
  }
});

      // Contenido (contenido original)
      const contenidoH2 = document.querySelector('.contenido h2[data-text-key="contenido_h2"]');
      if(contenidoH2) contenidoH2.textContent = texts.contenido_h2;

      const contenidoListItems = document.querySelectorAll('.contenido ul li');
      if (contenidoListItems[0]) {
          const strong = contenidoListItems[0].querySelector('strong');
          if(strong) strong.textContent = texts.contenido_li_1_strong;
          contenidoListItems[0].querySelector('span[data-text-key="contenido_li_1_text"]').textContent = texts.contenido_li_1_text;
      }
      if (contenidoListItems[1]) {
          const strong = contenidoListItems[1].querySelector('strong');
          if(strong) strong.textContent = texts.contenido_li_2_strong;
          contenidoListItems[1].querySelector('span[data-text-key="contenido_li_2_text"]').textContent = texts.contenido_li_2_text;
      }
      if (contenidoListItems[2]) {
          const strong = contenidoListItems[2].querySelector('strong');
          if(strong) strong.textContent = texts.contenido_li_3_strong;
          contenidoListItems[2].querySelector('span[data-text-key="contenido_li_3_text"]').textContent = texts.contenido_li_3_text;
      }
      if (contenidoListItems[3]) {
          const strong = contenidoListItems[3].querySelector('strong');
          if(strong) strong.textContent = texts.contenido_li_4_strong;
          contenidoListItems[3].querySelector('span[data-text-key="contenido_li_4_text"]').textContent = texts.contenido_li_4_text;
      }
      const contenidoP = document.querySelector('.contenido p[data-text-key="contenido_p_1"]');
      if(contenidoP) contenidoP.textContent = texts.contenido_p_1;

      // Contenido_2
      const contenido2H2 = document.querySelector('.contenido_2 h2[data-text-key="contenido2_h2"]');
      if(contenido2H2) contenido2H2.textContent = texts.contenido2_h2;
      
      const contenido2ListItems = document.querySelectorAll('.contenido_2 ul li');
      if (contenido2ListItems[0]) {
          const strong = contenido2ListItems[0].querySelector('strong');
          if(strong) strong.textContent = texts.contenido2_li_1_strong;
          contenido2ListItems[0].querySelector('span[data-text-key="contenido2_li_1_text"]').textContent = texts.contenido2_li_1_text;
      }
      if (contenido2ListItems[1]) {
          const strong = contenido2ListItems[1].querySelector('strong');
          if(strong) strong.textContent = texts.contenido2_li_2_strong;
          contenido2ListItems[1].querySelector('span[data-text-key="contenido2_li_2_text"]').textContent = texts.contenido2_li_2_text;
      }
      if (contenido2ListItems[2]) {
          const strong = contenido2ListItems[2].querySelector('strong');
          if(strong) strong.textContent = texts.contenido2_li_3_strong;
          contenido2ListItems[2].querySelector('span[data-text-key="contenido2_li_3_text"]').textContent = texts.contenido2_li_3_text;
      }
      if (contenido2ListItems[3]) {
          const strong = contenido2ListItems[3].querySelector('strong');
          if(strong) strong.textContent = texts.contenido2_li_4_strong;
          contenido2ListItems[3].querySelector('span[data-text-key="contenido2_li_4_text"]').textContent = texts.contenido2_li_4_text;
      }
      if (contenido2ListItems[4]) {
          const strong = contenido2ListItems[4].querySelector('strong');
          if(strong) strong.textContent = texts.contenido2_li_5_strong;
          contenido2ListItems[4].querySelector('span[data-text-key="contenido2_li_5_text"]').textContent = texts.contenido2_li_5_text;
      }
      const contenido2P = document.querySelector('.contenido_2 p[data-text-key="contenido2_p_1"]');
      if(contenido2P) contenido2P.textContent = texts.contenido2_p_1;


      // Contenido_3
      const contenido3H2 = document.querySelector('.contenido_3 h2[data-text-key="contenido3_h2"]');
      if(contenido3H2) contenido3H2.textContent = texts.contenido3_h2;

      const contenido3ListItems = document.querySelectorAll('.contenido_3 ul li');
      if (contenido3ListItems[0]) {
          const strong = contenido3ListItems[0].querySelector('strong');
          if(strong) strong.textContent = texts.contenido3_li_1_strong;
          contenido3ListItems[0].querySelector('span[data-text-key="contenido3_li_1_text"]').textContent = texts.contenido3_li_1_text;
      }
      if (contenido3ListItems[1]) {
          const strong = contenido3ListItems[1].querySelector('strong');
          if(strong) strong.textContent = texts.contenido3_li_2_strong;
          contenido3ListItems[1].querySelector('span[data-text-key="contenido3_li_2_text"]').textContent = texts.contenido3_li_2_text;
      }
      if (contenido3ListItems[2]) {
          const strong = contenido3ListItems[2].querySelector('strong');
          if(strong) strong.textContent = texts.contenido3_li_3_strong;
          contenido3ListItems[2].querySelector('span[data-text-key="contenido3_li_3_text"]').textContent = texts.contenido3_li_3_text;
      }
      

      // Pie de página - NO ALTERADO EN JS
      // La lógica del footer permanece sin cambios en el JS, ya que el requerimiento es no alterarlo.
      
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
