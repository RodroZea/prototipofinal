// Este script maneja animaciones y la traducción de la página.

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
            { selector: '.contenido_1:first-of-type', animation: 'custom', direction: 'stagger' }, // Contenido 1 con animación escalonada
            { selector: '.imagen_principal:nth-of-type(2)', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.contenido_1:nth-of-type(2)', animation: 'fadeInUp', direction: 'up', distance: 40 }, // Segundo contenido 1
            { selector: '.imagen_principal:nth-of-type(3)', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.contenido_3', animation: 'fadeInRight', direction: 'right', distance: 50 },
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
        // Selecciona todos los elementos de texto dentro del contenedor
        const children = element.querySelectorAll('h1, h2, h3, p, li');
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
        pageTitle: 'Riesgos de la Automedicación',

        // Barra superior y navegación
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',

        // Imágenes principales y de contenido (debes tener estas imágenes en español)
        image_main_risk: 'NO_TE_ARRIESGUES_esp.webp', 
        image_pharmaceutical_risks: 'RIESGOS_FARMACEUTICOS_esp.webp', 
        image_frascos: 'FRASCOS_esp.webp',
        
        // Contenido Principal
        contenido1_h2_1: 'El Problema de la Automedicación',
        contenido1_p_1: '"Los medicamentos son herramientas eficaces para proteger la salud. Sin embargo, los medicamentos que se recetan de forma incorrecta, se toman de forma indebida o son de mala calidad pueden causar graves daños", afirmó el Dr. Tedros Adhanom Ghebreyesus, Director General de la OMS. "Nadie debería sufrir daños por la atención sanitaria".',
        contenido1_h2_2: 'Comportamientos Utilizados',
        contenido1_p_2: 'Las personas desarrollan ciertas conductas, propias o adoptadas, al consumir medicamentos sin receta. <br> Los comportamientos más comunes incluyen:',
        contenido1_li_1: 'Recetado en la farmacia.',
        contenido1_li_2: 'Por recomendación de amigos y familiares.',
        contenido1_li_3: 'Cambios en la dosis prescrita por un médico.',
        contenido1_li_4: 'Interrupción o prolongación del tratamiento médico.',
        
        contenido2_h2: 'Complicaciones Asociadas al Uso de Medicamentos de Venta Libre',
        contenido2_p_1: 'Existen varios riesgos asociados al uso de medicamentos sin receta. En general, todos los medicamentos conllevan cierto nivel de riesgo, ya sean de venta libre o no. Los principales riesgos al utilizar medicamentos sin receta son:',
        contenido2_li_1_strong: 'Interacciones negativas con otros medicamentos',
        contenido2_li_1_text: ' (ej., para pacientes con enfermedades crónicas).',
        contenido2_li_2: 'Riesgo de intoxicación.',
        contenido2_li_3: 'Adicción a medicamentos.',
        contenido2_li_4_strong: 'Resistencia microbiana',
        contenido2_li_4_text: ' (debido al uso indebido de antibióticos).',
        contenido2_li_5_strong: 'Retraso en el diagnóstico de la enfermedad real',
        contenido2_li_5_text: ', que puede asociarse al efecto placebo.',
        contenido2_p_final: 'Comprendiendo qué es la automedicación y sus posibles consecuencias, queda claro que educar a la población sobre el uso seguro de los medicamentos de venta libre es la principal herramienta para combatirla. Para mayor seguridad, los medicamentos de cualquier tipo deben utilizarse siempre bajo orientación médica.',

        contenido3_h2: 'La Automedicación Presenta Varios Riesgos para la Salud',
        contenido3_p_1_strong: 'Analgésicos:',
        contenido3_p_1_text: ' El uso excesivo puede causar daño renal y adicción a narcóticos, lo que conlleva graves consecuencias, incluyendo sobredosis potencialmente mortales.',
        contenido3_p_2_strong: 'Hipertensión:',
        contenido3_p_2_text: ' Los medicamentos de venta libre pueden elevar la presión arterial, lo que es peligroso para personas con hipertensión.',
        contenido3_p_3_strong: 'Ansiolíticos:',
        contenido3_p_3_text: ' El abuso de ansiolíticos puede causar somnolencia, problemas de memoria y concentración, aumentando el riesgo de accidentes.',
        contenido3_p_4_strong: 'Estimulantes:',
        contenido3_p_4_text: ' El uso excesivo de estimulantes puede provocar problemas cardíacos, insomnio y ansiedad.',
        contenido3_p_5_strong: 'Antibióticos:',
        contenido3_p_5_text: ' El uso inapropiado de antibióticos fortalece las bacterias, contribuyendo a la resistencia antimicrobiana.',
        
        // Sección de reproductor de medios
        media_player_title: 'Nuestros Podcasts',
        media_audio_title: 'Canción SoundHelix 1 (Ejemplo de Podcast)',
        
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
        pageTitle: 'Self-Medication Risks',

        // Barra superior y navegación
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Features and Benefits',
        aboutNav: 'About Us',
        blogNav: 'Blog',

        // Imágenes principales y de contenido
        image_main_risk: 'MEDICAMENTO.webp', 
        image_pharmaceutical_risks: 'PHARMACEUTICAL_RISKS.webp', 
        image_frascos: 'FRASCOS.webp',
        
        // Contenido Principal
        contenido1_h2_1: 'The Problem with Self-Medication',
        contenido1_p_1: '"Medications are effective tools for protecting health. However, medications that are prescribed incorrectly, taken improperly, or are of poor quality can cause serious harm," said Dr. Tedros Adhanom Ghebreyesus, Director-General of WHO. "No one should suffer harm due to healthcare."',
        contenido1_h2_2: 'Behaviors Used',
        contenido1_p_2: 'People develop certain behaviors, whether their own or adopted, when using medications without a prescription. <br> The most common behaviors include:',
        contenido1_li_1: 'Prescribed at the pharmacy.',
        contenido1_li_2: 'By recommendation from friends and family.',
        contenido1_li_3: 'Changes in the prescribed dosage by a doctor.',
        contenido1_li_4: 'Interrupting or prolonging the medical treatment.',

        contenido2_h2: 'Complications Associated with Over-the-Counter Medication Use',
        contenido2_p_1: 'There are several risks associated with using medications without a prescription. In general, all medications carry some level of risk, whether they are over-the-counter or not. The primary risks when using medications without a prescription are:',
        contenido2_li_1_strong: 'Negative interactions with other medications',
        contenido2_li_1_text: ' (e.g., for patients with chronic diseases).',
        contenido2_li_2: 'Risk of poisoning.',
        contenido2_li_3: 'Medication addiction.',
        contenido2_li_4_strong: 'Microbial resistance',
        contenido2_li_4_text: ' (due to the misuse of antibiotics).',
        contenido2_li_5_strong: 'Delay in diagnosing the actual disease',
        contenido2_li_5_text: ', which can be associated with the placebo effect.',
        contenido2_p_final: 'Understanding what self-medication is and its possible consequences, it is clear that educating the population about the safe use of over-the-counter drugs is the main tool to combat it. For greater safety, medications of any kind should always be used under medical guidance.',
        
        contenido3_h2: 'Self-Medication Presents Several Health Risks',
        contenido3_p_1_strong: 'Pain relievers:',
        contenido3_p_1_text: ' Excessive use can cause kidney damage and narcotic addiction, leading to severe consequences, including potentially fatal overdoses.',
        contenido3_p_2_strong: 'Hypertension:',
        contenido3_p_2_text: ' Over-the-counter medications can raise blood pressure, which is dangerous for people with hypertension.',
        contenido3_p_3_strong: 'Anxiolytics:',
        contenido3_p_3_text: ' Abusing anxiolytics can cause drowsiness, memory issues, and concentration problems, increasing the risk of accidents.',
        contenido3_p_4_strong: 'Stimulants:',
        contenido3_p_4_text: ' The excessive use of stimulants can lead to heart problems, insomnia, and anxiety.',
        contenido3_p_5_strong: 'Antibiotics:',
        contenido3_p_5_text: ' Inappropriate use of antibiotics strengthens bacteria, contributing to antimicrobial resistance.',

        // Sección de reproductor de medios
        media_player_title: 'Our Podcasts',
        media_audio_title: 'SoundHelix Song 1 (Podcast Example)',
        
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
    img.src = `/static/images/${imageFile}`;
  } else {
    console.warn(`⚠️ Imagen no encontrada para "${imageKey}"`);
  }
});


      // Contenido_1 (primera aparición)
      const contenido1_first = document.querySelector('.contenido_1:first-of-type');
      if(contenido1_first) {
        const h2_1 = contenido1_first.querySelector('h2[data-text-key="contenido1_h2_1"]');
        if (h2_1) h2_1.textContent = texts.contenido1_h2_1;
        const p_1 = contenido1_first.querySelector('p[data-text-key="contenido1_p_1"]');
        if (p_1) p_1.textContent = texts.contenido1_p_1;
        const h2_2 = contenido1_first.querySelector('h2[data-text-key="contenido1_h2_2"]');
        if (h2_2) h2_2.textContent = texts.contenido1_h2_2;
        const p_2 = contenido1_first.querySelector('p[data-text-key="contenido1_p_2"]');
        if (p_2) p_2.innerHTML = texts.contenido1_p_2; // Usar innerHTML para <br>
        
        const li_elements = contenido1_first.querySelectorAll('ul li');
        if(li_elements[0]) li_elements[0].textContent = texts.contenido1_li_1;
        if(li_elements[1]) li_elements[1].textContent = texts.contenido1_li_2;
        if(li_elements[2]) li_elements[2].textContent = texts.contenido1_li_3;
        if(li_elements[3]) li_elements[3].textContent = texts.contenido1_li_4;
      }

      // Contenido_1 (segunda aparición)
      const contenido1_second = document.querySelector('.contenido_1:nth-of-type(2)');
      if(contenido1_second) {
        const h2 = contenido1_second.querySelector('h2[data-text-key="contenido2_h2"]');
        if (h2) h2.textContent = texts.contenido2_h2;
        const p_1 = contenido1_second.querySelector('p[data-text-key="contenido2_p_1"]');
        if (p_1) p_1.textContent = texts.contenido2_p_1;

        const li_elements = contenido1_second.querySelectorAll('ul li');
        if (li_elements[0]) {
            const strong = li_elements[0].querySelector('strong');
            if(strong) strong.textContent = texts.contenido2_li_1_strong;
            li_elements[0].innerHTML = (strong ? strong.outerHTML : '') + texts.contenido2_li_1_text;
        }
        if(li_elements[1]) li_elements[1].textContent = texts.contenido2_li_2;
        if(li_elements[2]) li_elements[2].textContent = texts.contenido2_li_3;
        if (li_elements[3]) {
            const strong = li_elements[3].querySelector('strong');
            if(strong) strong.textContent = texts.contenido2_li_4_strong;
            li_elements[3].innerHTML = (strong ? strong.outerHTML : '') + texts.contenido2_li_4_text;
        }
        if (li_elements[4]) {
            const strong = li_elements[4].querySelector('strong');
            if(strong) strong.textContent = texts.contenido2_li_5_strong;
            li_elements[4].innerHTML = (strong ? strong.outerHTML : '') + texts.contenido2_li_5_text;
        }

        const p_final = contenido1_second.querySelector('p#Parrafo_final');
        if (p_final) p_final.textContent = texts.contenido2_p_final;
      }

      // Contenido_3
      const contenido3_elem = document.querySelector('.contenido_3');
      if (contenido3_elem) {
        const h2 = contenido3_elem.querySelector('h2[data-text-key="contenido3_h2"]');
        if (h2) h2.textContent = texts.contenido3_h2;

        const p_elements = contenido3_elem.querySelectorAll('p');
        if (p_elements[0]) {
            const strong = p_elements[0].querySelector('strong');
            if(strong) strong.textContent = texts.contenido3_p_1_strong;
            p_elements[0].innerHTML = (strong ? strong.outerHTML : '') + texts.contenido3_p_1_text;
        }
        if (p_elements[1]) {
            const strong = p_elements[1].querySelector('strong');
            if(strong) strong.textContent = texts.contenido3_p_2_strong;
            p_elements[1].innerHTML = (strong ? strong.outerHTML : '') + texts.contenido3_p_2_text;
        }
        if (p_elements[2]) {
            const strong = p_elements[2].querySelector('strong');
            if(strong) strong.textContent = texts.contenido3_p_3_strong;
            p_elements[2].innerHTML = (strong ? strong.outerHTML : '') + texts.contenido3_p_3_text;
        }
        if (p_elements[3]) {
            const strong = p_elements[3].querySelector('strong');
            if(strong) strong.textContent = texts.contenido3_p_4_strong;
            p_elements[3].innerHTML = (strong ? strong.outerHTML : '') + texts.contenido3_p_4_text;
        }
        if (p_elements[4]) {
            const strong = p_elements[4].querySelector('strong');
            if(strong) strong.textContent = texts.contenido3_p_5_strong;
            p_elements[4].innerHTML = (strong ? strong.outerHTML : '') + texts.contenido3_p_5_text;
        }
      }

      // Sección de reproductor de medios
      const mediaPlayerTitle = document.querySelector('.media-player-section h2[data-text-key="media_player_title"]');
      if (mediaPlayerTitle) mediaPlayerTitle.textContent = texts.media_player_title;
      
      const mediaAudioTitle = document.querySelector('.media-player-section .media-title h3[data-text-key="media_audio_title"]');
      if (mediaAudioTitle) mediaAudioTitle.textContent = texts.media_audio_title;

      // Pie de página
      const footerColumns = document.querySelectorAll('.main-footer .footer-column');
      if (footerColumns[0]) {
        const footerH3 = footerColumns[0].querySelector('h3[data-text-key="footer_h3"]');
        if(footerH3) footerH3.innerHTML = texts.footer_h3.replace('\n', '<br>');
        
        const footerP = footerColumns[0].querySelectorAll('p[data-text-key]'); // Selecciona todos los <p> con data-text-key
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
        // Los posts recientes (fechas y títulos) se mantienen sin traducir, ya que suelen ser contenido dinámico o específico.
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
  
  // Lógica del reproductor de audio (Copied from journal4.html script)
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
      // No hay un volumen icon directamente, se cambia todo el innerHTML
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